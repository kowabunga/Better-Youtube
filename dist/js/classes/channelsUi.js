class ChannelsUi {
  buildHeaderSection(channelInfo) {
    const output = '';
  }

  populateChannelSection(data) {
    const output = '';
    const channelInfo = data.result.items[0];
    this.buildHeaderSection(channelInfo);
    console.log(data);

    channelContainer.innerHTML = '<div>Hello World</div>';
  }
}
