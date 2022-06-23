class MockCardService {
  static newCardBuilder() {
    return new MockCardBuilder();
  }
  static newCardSection() {
    return new MockCardSection();
  }
  static newTextParagraph() {
    return new MockTextParagraph();
  }
  static newFixedFooter() {
    return new MockFixedFooter();
  }
  static newTextButton() {
    return new MockTextButton();
  }
  static newOpenLink() {
    return new MockOpenLink();
  }
  static newAction() {
    return new MockAction();
  }
}

class MockCardBuilder {
  constructor() {
    this.card = {
      sections: [],
    };
  }
  /**
   * @param {Object} cardSection
   * @returns This CardSection, for chaining
   */
  addSection(cardSection) {
    this.card.sections.push(cardSection.output());
    return this;
  }
  setFixedFooter(cardFixedFooter) {
    this.card['fixedFooter'] = cardFixedFooter.output();
    return this;
  }
  build() {
    return this.card;
  }
}

class MockCardSection {
  constructor() {
    this.section = {
      widgets: [],
    };
  }
  /**
   * @param {Object} cardWidget
   * @returns This MockCardSection, for chaining
   */
  addWidget(cardWidget) {
    this.section.widgets.push(cardWidget.output());
    return this;
  }
  output() {
    return this.section;
  }
}

class MockTextParagraph {
  constructor() {
    this.text = '';
  }
  /**
   * @param {String} text
   */
  setText(text) {
    this.text = text;
    return this;
  }
  output() {
    return { text: this.text };
  }
}

class MockFixedFooter {
  constructor() {
    this.primaryButton = {};
    this.secondaryButton = {};
  }
  setPrimaryButton(cardButton) {
    this.primaryButton = cardButton.output();
    return this;
  }
  setSecondaryButton(cardButton) {
    this.secondaryButton = cardButton.output();
    return this;
  }
  output() {
    return {
      primaryButton: this.primaryButton,
      secondaryButton: this.secondaryButton,
    };
  }
}

class MockTextButton {
  constructor() {
    this.text = '';
    this.openLink = '';
    this.onClickAction = {};
  }
  /**
   * @param {String} text
   * @returns This MockTextButton, for chaining
   */
  setText(text) {
    this.text = text;
    return this;
  }
  setOnClickAction(cardAction) {
    this.onClickAction = cardAction.output();
    return this;
  }
  /**
   * @param {String} openLink
   * @returns This MockTextButton, for chaining
   */
  setOpenLink(openLink) {
    this.openLink = openLink.output();
    return this;
  }
  output() {
    return {
      text: this.text,
      onClickAction: this.onClickAction,
      openLink: this.openLink,
    };
  }
}
class MockOpenLink {
  constructor() {
    this.url = '';
  }
  /**
   * @param {String} url
   * @returns {String}
   */
  setUrl(url) {
    this.url = url;
    return this;
  }
  output() {
    return this.url;
  }
}
class MockAction {
  constructor() {
    this.functionName = '';
  }
  /**
   * @param {String} functionName
   * @returns This MockAction, for chaining
   */
  setFunctionName(functionName) {
    this.functionName = functionName;
    return this;
  }
  output() {
    return { functionName: this.functionName };
  }
}

module.exports = { MockCardService };
