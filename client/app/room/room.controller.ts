'use strict';

export default class RoomCtrl {

  channel;
  uuid;
  messageContent;
  Pubnub;
  messages;

  /*@ngInject*/
  constructor(Pubnub) {
    this.Pubnub = Pubnub;
  }

  $onInit() {
    this.channel = 'messages-channel';
    this.uuid = _.random(100).toString();
    this.Pubnub.init({
      publish_key: 'pub-c-09e8c766-90e0-49b0-b856-be30a13a434c',
      subscribe_key: 'sub-c-53c329a4-3f8e-11e7-a72b-02ee2ddab7fe',
      uuid: this.uuid
    });
    // Subscribing to the ‘messages-channel’ and trigering the message callback
    this.Pubnub.subscribe({
      channel: this.channel,
      triggerEvents: ['callback']
    });
  }

  sendMessage() {
    // Don't send an empty message
    if (!this.messageContent || this.messageContent === '') {
      return;
    }
    this.Pubnub.publish({
      channel: this.channel,
      message: {
        content: this.messageContent,
        sender_uuid: this.uuid,
        date: new Date()
      },
      callback: function (m) {
        console.log(m);
      }
    });
    // Reset the messageContent input
    this.messageContent = '';
    this.messages = [];
  }

// A function to display a nice uniq robot avatar
    avatarUrl(uuid) {
      return 'http://robohash.org/' + uuid + '?set=set2&bgset=bg2&size=70x70';
    }
}
