import { promises as fs } from "fs"
import * as os from "os"
import * as path from "path"
import * as tr from "text-runner"
import * as util from "util"

export default async function (args: tr.actions.Args) {
  const expected = args.region
    .text()
    .replace(/make\s*/, "")
    .trim()
  args.name(`verify Make command "${expected}" exists`)
  const makefilePath = path.join(args.configuration.sourceDir.value, "Makefile")
  const makefileContent = await fs.readFile(makefilePath, "utf8")
  const commands = makefileContent.split(os.EOL).filter(lineDefinesMakeCommand).map(extractMakeCommand)
  if (!commands.includes(expected)) {
    throw new Error(`Make command "${expected}" not found in: ${util.inspect(commands)}`)
  }
}

// returns whether the given line from a Makefile
// defines a Make command
function lineDefinesMakeCommand(line: string): boolean {
  return makeCommandRE.test(line)
}
const makeCommandRE = /^[^ ]+:/

// returns the defined command name
// from a Makefile line that defines a Make command
function extractMakeCommand(line: string): string {
  const result = line.split(":")[0]
  if (result == null) {
    throw new Error(`Makefile line "${line}" does not contain a ":" character`)
  }
  return result
}
