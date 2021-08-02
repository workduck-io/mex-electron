export type Command = 'webem';

export interface SlashCommandConfig {
  command: Command;
  slateElementType: string;
  options?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
