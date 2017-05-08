'use strict';

export default class ChatCtrl {
  message: string;

  /*@ngInject*/
  constructor() {
    this.message = 'hello';
  }

  test() {
    this.message = 'yo';
  }
}
