'use strict';

export default class RoomCtrl {
  message: string;

  /*@ngInject*/
  constructor() {
    this.message = 'hello';
  }

  test() {
    this.message = 'yo';
  }
}
