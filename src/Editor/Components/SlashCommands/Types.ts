export type command = 'webem';

export interface SlashCommandHandler {
  command: command;
  slateElementType: string;
  options?: any;
}
