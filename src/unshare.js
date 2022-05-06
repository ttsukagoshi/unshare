/*
   Copyright 2022 Taro TSUKAGOSHI

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   See the GitHub repository for more details: https://github.com/ttsukagoshi/unshare
*/

const CACHE_EXPIRATION_IN_SEC = 3600; // TTL of user cache in seconds
const ADDON_EXEC_TIME_LIMIT_IN_MILLISEC = 30 * 1000; // Execution time limit of Google Workspace Add-ons in milliseconds, as specified in https://developers.google.com/apps-script/add-ons/concepts/actions#callback_functions
const ADDON_EXEC_TIME_LIMIT_WITH_BUFFER =
  ADDON_EXEC_TIME_LIMIT_IN_MILLISEC * 0.9;

//////////////////////////
// Add-on Card Builders //
//////////////////////////

/**
 * Create the common homepage card for the add-on.
 * @param {Object} event Google Workspace Add-on Event object.
 * @returns {Object} Google Workspace Add-on Card object.
 * @see https://developers.google.com/workspace/add-ons/concepts/event-objects
 */
function buildHomepage(event) {
  console.log(JSON.stringify(event)); // debug
  // Build card
  let builder = CardService.newCardBuilder();
  // Message Section
  builder.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextParagraph().setText(
        'Press the "Continue" button to stop sharing the files with your collaborators.\n\nUnshare will delete all editors, commenters, and viewers from this file/folder except for you, the owner.\n\n<b>THIS PROCESS CANNOT BE UNDONE</b>.'
      )
    )
  );
  // Fixed Footer
  builder.setFixedFooter(
    CardService.newFixedFooter()
      .setPrimaryButton(
        CardService.newTextButton()
          .setText('CONTINUE')
          .setOnClickAction(
            CardService.newAction().setFunctionName('buildConfirmationPage')
          )
      )
      .setSecondaryButton(
        CardService.newTextButton()
          .setText('HELP')
          .setOpenLink(
            CardService.newOpenLink().setUrl(
              'https://www.scriptable-assets.page/add-ons/unshare/'
            )
          )
      )
  );
  return builder.build();
}

/**
 * Create the Drive-specific homepage card for the add-on.
 * The user will see this card when triggering this add-on
 * without selecting any files on the Google Drive UI.
 * @returns {Object} Google Workspace Add-on Card object.
 * @see https://developers.google.com/apps-script/add-ons/drive/building-drive-interfaces#drive_homepages
 */
function buildDriveHomepage(event) {
  console.log(JSON.stringify(event)); // debug
  // Build card
  let builder = CardService.newCardBuilder();
  // Message Section
  builder.addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextParagraph().setText(
        'Select file(s) that you want to "un"share. Only the files that you own can be processed.'
      )
    )
  );
  return builder.build();
}

/**
 * Create card for Google Drive when file(s) are selected.
 * @param {Object} event Google Workspace Add-on Event object.
 * @returns {Object} Google Workspace Add-on Card object.
 */
function buildDriveItemsSelected(event) {
  // console.log(JSON.stringify(event)); // debug
  return buildHomepage(event);
}

/**
 * Create the confirmation card for the add-on.
 * Checks if the target file's owner is the user executing the add-on; if not,
 * returns a message card that the add-on must be executed by the owner.
 * @param {Object} event Google Workspace Add-on Event object.
 * @returns {Object} Google Workspace Add-on Card object.
 * @see https://developers.google.com/workspace/add-ons/concepts/event-objects
 */
function buildConfirmationPage(event) {
  console.log(JSON.stringify(event)); // debug
  let isHostDrive = event.commonEventObject.hostApp === 'DRIVE';
  try {
    let fileUsers = getFileUsers(event);
    if (fileUsers.isOwner.length > 0) {
      const targetFilesSummary = fileUsers.isOwner.reduce((text, file) => {
        let editorList = file.editors
          .map((editor) => ` - ${editor} (editor)`)
          .join('\n');
        let viewerList = file.viewers
          .map((viewer) => ` - ${viewer} (viewer/commenter)`)
          .join('\n');
        text += `\n<b>${file.fileName}</b>\n${editorList}\n${viewerList}\n`;
        return text;
      }, '');
      const ignoredFilesSummary =
        fileUsers.isNotOwner.length === 0
          ? ''
          : fileUsers.isNotOwner.reduce((text, file) => {
              text += `\n * ${file.fileName}`;
              return text;
            }, 'Note that the files below will be ignored since you are not the owner:');
      let builder = CardService.newCardBuilder();
      builder.addSection(
        CardService.newCardSection().addWidget(
          CardService.newTextParagraph().setText(
            `Are you sure you want to proceed with Unshare? You will be permanently removing all editors and viewers (including commenters) from these file/folder(s):${targetFilesSummary}\n<b>THIS ACTION CANNOT BE UNDONE</b>.\n\n${ignoredFilesSummary}`
          )
        )
      );
      // Fixed Footer
      const functionName = isHostDrive ? 'buildDriveHomepage' : 'buildHomepage';
      builder.setFixedFooter(
        CardService.newFixedFooter()
          .setPrimaryButton(
            CardService.newTextButton()
              .setText('Cancel')
              .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
              .setOnClickAction(
                CardService.newAction().setFunctionName(functionName)
              )
          )
          .setSecondaryButton(
            CardService.newTextButton()
              .setText('Unshare')
              .setOnClickAction(
                CardService.newAction().setFunctionName('unshare')
              )
          )
      );
      return builder.build();
    } else {
      let isNotOwnerFileNameList = fileUsers.isNotOwner
        .map((isNotOwnerFile) => ` - ${isNotOwnerFile.fileName}`)
        .join('\n');
      throw new Error(
        `[ERROR] You must be the owner of the file/folder(s) to execute Unshare:\n${isNotOwnerFileNameList}`
      );
    }
  } catch (error) {
    return createMessageCard(
      filteredErrorMessage(error),
      event.commonEventObject.userLocale,
      event.commonEventObject.hostApp === 'DRIVE'
    );
  }
}

function unshare(event) {
  console.log(JSON.stringify(event)); // debug
  const start = new Date();
  try {
    let fileUsers = getFileUsers(event, true);
    fileUsers.isOwner.forEach((fileSummary, i, ownerArr) => {
      let file = DriveApp.getFileById(fileSummary.fileId);
      // Set the access status to PRIVATE
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
      // Remove Editors
      fileSummary.editors.forEach((editor) => {
        file.removeEditor(editor);
        // Check the execution time and quit if the runtime is expected to exceeed the time limit
        checkExecTime(start, i, ownerArr, false);
      });
      // Remove Viewers and Commentors
      fileSummary.viewers.forEach((viewer) => {
        file.removeViewer(viewer);
        checkExecTime(start, i, ownerArr, false);
      });
      checkExecTime(start, i, ownerArr, true);
    });
    return createMessageCard(
      'All file(s)/folder(s) have been "un"shared.',
      event.commonEventObject.userLocale,
      event.commonEventObject.hostApp === 'DRIVE'
    );
  } catch (error) {
    return createMessageCard(
      filteredErrorMessage(error),
      event.commonEventObject.userLocale,
      event.commonEventObject.hostApp === 'DRIVE'
    );
  }
}

/**
 * The general card object generator for errors and other messages to the add-on user.
 * @param {String} message The message to tell the user
 * @param {String} userLocale The user's locale specified in the event object.
 * https://developers.google.com/apps-script/add-ons/concepts/event-objects#common_event_object
 * @param {Boolean} isHostDrive Set to true when executed on Google Drive. Defaults to false.
 * @returns {Object} Google Workspace Add-on Card object.
 */
function createMessageCard(message, userLocale, isHostDrive = false) {
  // var localizedMessage = new LocalizedMessage(userLocale);
  console.log(`message: ${message}\nuserLocale: ${userLocale}`); // debug
  const functionName = isHostDrive ? 'buildDriveHomepage' : 'buildHomepage';
  let builder = CardService.newCardBuilder().addSection(
    CardService.newCardSection().addWidget(
      CardService.newTextParagraph().setText(message)
    )
  );
  // Fixed Footer
  builder.setFixedFooter(
    CardService.newFixedFooter().setPrimaryButton(
      CardService.newTextButton()
        .setText('Return Home')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction().setFunctionName(functionName))
    )
  );
  return builder.build();
}

/**
 * Get the list of the file/folders' respective owner, editors, and viewers (including commenters)
 * based on the incoming Google Workspace Add-on event.
 * Refers to info saved in user cache whenever available.
 * @param {Object} event Google Workspace Add-on Event object.
 * @param {Boolean} useCache Will not refer to user cache when false, the default value.
 * @returns {Object} Summarized JavaScript objects of the input files with their respective owner, editors, and viewers.
 */
function getFileUsers(event, useCache = false) {
  const cache = CacheService.getUserCache();
  // Get the array of target file/folder IDs from the event object
  let fileIds = [];
  switch (event.commonEventObject.hostApp) {
    case 'DRIVE':
      fileIds = event.drive.selectedItems.map((item) => item.id);
      break;
    case 'SHEETS':
      fileIds.push(SpreadsheetApp.getActiveSpreadsheet().getId());
      break;
    case 'DOCS':
      fileIds.push(DocumentApp.getActiveDocument().getId());
      break;
    case 'SLIDES':
      fileIds.push(SlidesApp.getActivePresentation().getId());
      break;
    default:
      throw new Error('[ERROR] Unshare is not available on this platform.');
  }
  // Get the list of users who have access to the target files/folders
  let fileUsers = fileIds.reduce(
    (obj, fileId) => {
      const cachedFileUserStr = cache.get(fileId);
      let fileUser;
      if (!cachedFileUserStr || !useCache) {
        // If the user info is not available as user cache
        const file = DriveApp.getFileById(fileId);
        const ownerEmail = file.getOwner().getEmail();
        // Get the list of editors
        const editors = file.getEditors().reduce((arr, editorUser) => {
          let editorEmail = editorUser.getEmail();
          if (editorEmail !== ownerEmail) {
            arr.push(editorEmail);
          }
          return arr;
        }, []);
        // Get the list of viewers and commentors
        const viewers = file.getViewers().reduce((arr, viewerUser) => {
          let viewerEmail = viewerUser.getEmail();
          if (viewerEmail !== ownerEmail && !editors.includes(viewerEmail)) {
            arr.push(viewerEmail);
          }
          return arr;
        }, []);
        fileUser = {
          fileId: fileId,
          fileName: file.getName(),
          fileType: file.getMimeType(),
          owner: ownerEmail,
          editors: editors,
          viewers: viewers,
        };
        // Save file info as user cache
        cache.put(fileId, JSON.stringify(fileUser), CACHE_EXPIRATION_IN_SEC);
      } else {
        fileUser = JSON.parse(cachedFileUserStr);
      }
      if (fileUser.owner === Session.getActiveUser().getEmail()) {
        obj.isOwner.push(fileUser);
      } else {
        obj.isNotOwner.push(fileUser);
      }
      return obj;
    },
    { isOwner: [], isNotOwner: [] }
  );
  console.log(JSON.stringify(fileUsers)); // debug
  return fileUsers;
}

/**
 * Checks the current add-on execution time and returns a time-out error when applicable
 * @param {Date} startTime Date object indicating the start time of the add-on execution
 * @param {Number} currentIndex Current index
 * @param {Array} originalFileArray The original array of target files
 * @param {Boolean} isFileEnd Indicator to show if this check function is executed at the end of a single file process. Defaults to false.
 */
function checkExecTime(
  startTime,
  currentIndex,
  originalFileArray,
  isFileEnd = false
) {
  if (
    new Date().getTime() - startTime.getTime() >=
    ADDON_EXEC_TIME_LIMIT_WITH_BUFFER
  ) {
    let slicePos = isFileEnd ? currentIndex + 1 : currentIndex;
    throw new Error(
      `[Exceeded Time Limit]\nThe execution time of Unshare is limited to ${
        ADDON_EXEC_TIME_LIMIT_IN_MILLISEC / 1000
      } seconds by Google. It could not finish "un"sharing the following file(s)/folder(s) due to this limit:\n${originalFileArray
        .slice(slicePos)
        .map((file) => file.fileName)
        .join('\n')}`
    );
  } else {
    return null;
  }
}

/**
 * Determines if the error is predefined and returns a simple error message in such cases.
 * If the error is not defined, this function will return a full error message in `error.stack`.
 * @param {Object} error Exceptions thrown in the script
 * @returns {String}
 */
function filteredErrorMessage(error) {
  return error.message.startsWith('[ERROR] ') ||
    error.message.startsWith('[Exceeded Time Limit]\n')
    ? error.message
    : error.stack;
}

if (typeof module === 'object') {
  module.exports = {
    buildHomepage,
    buildDriveHomepage,
    buildDriveItemsSelected,
    buildConfirmationPage,
    unshare,
  };
}
