import { productName } from '../../../package.json'
// import { useVersionStore } from '@store/useAppDataStore'
// import { checkIfAlpha } from '../../electron/utils/version'

// const version = useVersionStore.getState().version
// const productName = checkIfAlpha(version) ? 'Mex Alpha' : 'Mex'

export const script =
  '#!/usr/bin/osascript\n' +
  '\n' +
  `set exportFolder to (path to application support folder from user domain as text) & "${productName}:AppleNotes:"\n` +
  '\n' +
  '-- Simple text replacing\n' +
  'on replaceText(find, replace, subject)\n' +
  '\tset prevTIDs to text item delimiters of AppleScript\n' +
  '\tset text item delimiters of AppleScript to find\n' +
  '\tset subject to text items of subject\n' +
  '\t\n' +
  '\tset text item delimiters of AppleScript to replace\n' +
  '\tset subject to "" & subject\n' +
  '\tset text item delimiters of AppleScript to prevTIDs\n' +
  '\t\n' +
  '\treturn subject\n' +
  'end replaceText\n' +
  '\n' +
  '\n' +
  '-- Get an HTML file to save the note in.  We have to escape\n' +
  '-- the colons or AppleScript gets upset.\n' +
  'on noteNameToFilePath(noteName)\n' +
  '\tglobal exportFolder\n' +
  '\tset strLength to the length of noteName\n' +
  '\t\n' +
  '\tif strLength > 250 then\n' +
  '\t\tset noteName to text 1 thru 250 of noteName\n' +
  '\tend if\n' +
  '\t\n' +
  '\tset fileName to (exportFolder & replaceText(":", "_", noteName) & ".html")\n' +
  '\treturn fileName\n' +
  'end noteNameToFilePath\n' +
  '\n' +
  'tell application "Notes"\n' +
  '\t\n' +
  '\trepeat with theNote in notes of default account\n' +
  '\t\t\n' +
  '\t\t--repeat with theNote in notes in folder "New Folder" of default account\n' +
  '\t\tset noteLocked to password protected of theNote as boolean\n' +
  '\t\tset modDate to modification date of theNote as date\n' +
  '\t\tset creDate to creation date of theNote as date\n' +
  '\t\t\n' +
  '\t\tset noteID to id of theNote as string\n' +
  "\t\tset oldDelimiters to AppleScript's text item delimiters\n" +
  `\t\tset AppleScript's text item delimiters to "/"\n` +
  '\t\tset theArray to every text item of noteID\n' +
  "\t\tset AppleScript's text item delimiters to oldDelimiters\n" +
  '\t\t\n' +
  '\t\tif length of theArray > 4 then\n' +
  '\t\t\t-- the last part of the string should contain the ID\n' +
  '\t\t\t-- e.g. x-coredata://39376962-AA58-4676-9F0E-6376C665FDB6/ICNote/p599\n' +
  '\t\t\tset noteID to item 5 of theArray\n' +
  '\t\telse\n' +
  '\t\t\tset noteID to ""\n' +
  '\t\tend if\n' +
  '\t\t\n' +
  '\t\tif not noteLocked then\n' +
  '\t\t\t-- file name composed by id and note title to overcome overwriting files\n' +
  '\t\t\tset fileName to ("[" & noteID & "] " & (name of theNote as string)) as string\n' +
  '\t\t\tset filepath to noteNameToFilePath(fileName) of me\n' +
  '\t\t\tset noteFile to open for access filepath with write permission\n' +
  '\t\t\tset theText to body of theNote as string\n' +
  '\t\t\tset theContainer to container of theNote\n' +
  '\t\t\t\n' +
  '\t\t\twrite theText to noteFile as Unicode text\n' +
  '\t\t\tclose access noteFile\n' +
  '\t\t\t\n' +
  '\t\tend if\n' +
  '\t\t\n' +
  '\tend repeat\n' +
  '\t\n' +
  'end tell\n'
