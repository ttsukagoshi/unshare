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

const UP_KEY_FILE_USERS = 'fileUsers';
const UP_KEY_IS_HOST_DRIVE = 'isHostDrive';

//////////////////////////
// Add-on Card Builders //
//////////////////////////

/**
 * Create the common homepage card for the add-on.
 * @param {Object} event Google Workspace Add-on Event object.
 * @returns {Object} Google Workspace Add-on Card object.
 * @see https://developers.google.com/workspace/add-ons/concepts/event-objects
 */
function buildHomepage(/*event*/) {
  // console.log(JSON.stringify(event)); // debug
  // Build card
  let builder = CardService.newCardBuilder();
  // Message Section
  builder.addSection(
    CardService.newCardSection()
      .addWidget(
        CardService.newTextParagraph().setText(
          'Press the "Continue" button to stop sharing the files to your collaborators.\nNote that this process, which will delete all editors, commenters, and viewers from this file except for you, the owner, <b>IS IRREVERSIBLE</b>.'
        )
      )
      .addWidget(
        CardService.newButtonSet().addButton(
          CardService.newTextButton()
            .setText('Continue')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(
              CardService.newAction().setFunctionName('buildConfirmationPage')
            )
        )
      )
  );
  // Fixed Footer
  builder.setFixedFooter(
    CardService.newFixedFooter().setPrimaryButton(
      CardService.newTextButton()
        .setText('HELP')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
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
function buildDriveHomepage(/* event */) {
  // console.log(JSON.stringify(event)); // debug
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
  // console.log(JSON.stringify(event)); // debug
  const isHostDrive = event.commonEventObject.hostApp === 'DRIVE';
  let fileIds = [];
  try {
    switch (event.commonEventObject.hostApp) {
      case 'DRIVE':
        fileIds = event.drive.selectedItems.map((item) => item.id);
        break;
      case 'SHEETS':
        fileIds.push = SpreadsheetApp.getActiveSpreadsheet().getId();
        break;
      case 'DOCS':
        fileIds.push = DocumentApp.getActiveDocument().getId();
        break;
      case 'SLIDES':
        fileIds.push = SlidesApp.getActivePresentation().getId();
        break;
      default:
        throw new Error('Unshare is not available in this platform.');
    }
    let fileUsers = getFileUsers(fileIds);
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
        fileUsers.notOwner.length === 0
          ? ''
          : fileUsers.notOwner.reduce((text, file) => {
              text += `\n * ${file.fileName}`;
              return text;
            }, 'Note that the files below will be ignored since you are not the owner:');
      let builder = CardService.newCardBuilder();
      builder.addSection(
        CardService.newCardSection().addWidget(
          CardService.newTextParagraph().setText(
            `Are you sure you want to proceed with Unshare? You will be permanently removing all editors and viewers (including commenters) from these file(s):${targetFilesSummary}\n<b>THIS ACTION CANNOT BE UNDONE</b>.\n\n${ignoredFilesSummary}`
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
      PropertiesService.getUserProperties().setProperty(
        UP_KEY_IS_HOST_DRIVE,
        isHostDrive
      );
      return builder.build();
    } else {
      let notOwnerFileNameList = fileUsers.notOwner
        .map((notOwnerFile) => ` - ${notOwnerFile.fileName}`)
        .join('\n');
      throw new Error(
        `[Error] You must be the owner of the file(s) to execute Unshare:\n${notOwnerFileNameList}`
      );
    }
  } catch (error) {
    return createMessageCard(
      error.stack,
      event.commonEventObject.userLocale,
      isHostDrive
    );
  }
}

function unshare(event) {
  console.log(JSON.stringify(event)); // debug
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
 * Get the list of the files' respective owner, editors, and viewers (including commenters).
 * @param {Array} fileIds Array of Google Drive file IDs
 * @param {Boolean} returnUserObj [Optional] Returns user objects when true.
 * Defaults to false to return primary email addresses of the users.
 * @returns {Object} Summarized JavaScript objects of the input files with their respective owner, editors, and viewers.
 */
function getFileUsers(fileIds) {
  let fileUsers = fileIds.reduce(
    (obj, fileId) => {
      const file = DriveApp.getFileById(fileId);
      const fileName = file.getName();
      const owner = file.getOwner();
      const ownerEmail = owner.getEmail();
      const editors = file.getEditors().reduce(
        (editorsObj, editorUser) => {
          let editorEmail = editorUser.getEmail();
          if (editorEmail !== ownerEmail) {
            editorsObj.editorUsers.push(editorUser);
            editorsObj.editorEmails.push(editorEmail);
          }
          return editorsObj;
        },
        { editorUsers: [], editorEmails: [] }
      );
      const viewers = file.getViewers().reduce(
        (viewersObj, viewerUser) => {
          let viewerEmail = viewerUser.getEmail();
          if (
            viewerEmail !== ownerEmail &&
            !editors.editorEmails.includes(viewerEmail)
          ) {
            viewersObj.viewerUsers.push(viewerUser);
            viewersObj.viewerEmails.push(viewerEmail);
          }
          return viewersObj;
        },
        { viewerUsers: [], viewerEmails: [] }
      );
      let fileUser = {
        fileName: fileName,
        owner: ownerEmail,
        editors: editors.editorEmails,
        viewers: viewers.viewerEmails,
      };
      if (fileUser.owner === Session.getActiveUser().getEmail()) {
        obj.isOwner.push(fileUser);
      } else {
        obj.notOwner.push(fileUser);
      }
      return obj;
    },
    { isOwner: [], notOwner: [] }
  );
  PropertiesService.getUserProperties().setProperty(
    UP_KEY_FILE_USERS,
    JSON.stringify(fileUsers)
  );
  return fileUsers;
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
