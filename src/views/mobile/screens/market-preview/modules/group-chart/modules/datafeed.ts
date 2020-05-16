import ApiClient from "@zsmartex/z-apiclient";

export default class DataFeed {
  constructor() {}

  async fetchData(symbol, resolution) {
    const url = "public/markets/" + symbol + "/k-line";
    const payload = {
      period: resolution,
      limit: 100
    };
    try {
      const { data } = await new ApiClient("trade").get(url, payload);
      return data;
    } catch (error) {
      return [];
    }
  }

  changeData(payload) {
    return payload.map(row => ({
      open: row[1],
      high: row[2],
      low: row[3],
      close: row[4],
      volume: row[5],
      timestamp: row[0] * 1000,
      turnover: row[4] * row[5]
    }));
  }

  async getBars(symbol, resolution, from, to) {
    const chartData = await this.fetchData(symbol, resolution);
    const dataList = this.changeData(chartData);

    return dataList;
  }
}
