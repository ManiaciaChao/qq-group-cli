import prettyBytes from "pretty-bytes";
import { green, yellow, grey, red } from "chalk";
import {
  SingleBar as OriginSingleBar,
  MultiBar as OriginMultiBar,
  Options as OriginOptions,
  Preset,
} from "cli-progress";

type formatter = (options: Options, params: Params, payload: any) => string;

interface Options extends Omit<OriginOptions, "format"> {
  format?: string | formatter;
  barGlue?: string;
}

interface Payload {
  filename: string;
}

interface Params {
  value: number;
  total: number;
  [key: string]: any;
}

export class MultiBar extends OriginMultiBar {
  constructor(opt: Options, preset?: Preset) {
    super(opt as OriginOptions, preset);
  }
}

export class SingleBar extends OriginSingleBar {
  constructor(opt: Options, preset?: Preset) {
    super(opt as OriginOptions, preset);
  }
}

const color = (progress: number) => (str: string) => {
  if (progress <= 0.2) return red(str);
  if (progress <= 0.6) return yellow(str);
  return green(str);
};

// format bar
const formatBar = (progress: number, options: Options) => {
  // calculate barsize
  // const {barsize,barCompleteString,barIncompleteString} = options;
  const barsize = options.barsize ?? 40;
  const barCompleteString = options.barCompleteString ?? "=";
  const barIncompleteString = options.barIncompleteString ?? " ";
  const barGlue = options.barGlue ?? ">";
  const completeSize = Math.round(progress * barsize);
  const incompleteSize = barsize - completeSize;

  // generate bar string by stripping the pre-rendered strings
  return (
    color(progress)(barCompleteString.substr(0, completeSize) + barGlue) +
    barIncompleteString.substr(0, incompleteSize)
  );
};

const formatFilename = (filename: string) =>
  filename.length <= 20
    ? filename
    : filename.substr(0, 7) +
      "......" +
      filename.substr(filename.length - 7, 7);

export const customFormatter: formatter = (
  options,
  params,
  payload: Payload
) => {
  const { progress, startTime } = params;
  const percentage = color(progress)(
    (progress * 100).toFixed(1).padStart(5) + "%"
  );
  const elapsedTime = Math.round((Date.now() - startTime) / 1000);
  const bar = formatBar(progress, options);
  const value = prettyBytes(params.value);
  const total = grey(prettyBytes(params.total));
  const filename: string = yellow(
    formatFilename(payload.filename ?? "").padEnd(20)
  );

  return `${filename}\t[${bar}] ${percentage} [${value}/${total}]`;
};
