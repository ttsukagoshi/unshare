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
*/

//////////////////////////
// Add-on Card Builders //
//////////////////////////

/**
 * Function to create the homepage card for the add-on.
 * @param {Object} event Google Workspace Add-on Event object.
 * @see https://developers.google.com/workspace/add-ons/concepts/event-objects
 */
function buildHomepage(event) {
  // Build card
  let builder = CardService.newCardBuilder();
  // Message Section
  builder.addSection(
    CardService.newCardSection()
      .addWidget(
        CardService.newTextParagraph().setText(
          `Press the "Unshare" button to stop sharing the files to your collaborators.\nPlease note that this process, which will delete all editors, commentors, and viewers from this file except for you, the owner, <b>IS IRREVERSIBLE</b>.\n\n${JSON.stringify(
            event
          )}`
        )
      )
      .addWidget(
        CardService.newButtonSet().addButton(
          CardService.newTextButton()
            .setText('Unshare')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(
              CardService.newAction().setFunctionName('unshare')
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
        .setDisabled(false)
    )
    /*
      .setSecondaryButton(
        CardService.newTextButton()
          .setText('button 2')
          .setOnClickAction(
            CardService.newAction().setFunctionName('functionName')
          )
          .setDisabled(false)
      )
      */
  );
  return builder.build();
}

if (typeof module === 'object') {
  module.exports = { buildHomepage };
}
