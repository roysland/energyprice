const axios = require('axios')
module.exports = async function (context, req) {
    // https://www.nordpoolgroup.com/api/marketdata/page/24?currency=,NOK,NOK,EUR&endDate=08-03-2022
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowsDate = ('0' + tomorrow.getDate()).slice(-2) + '-'
    + ('0' + (tomorrow.getMonth()+1)).slice(-2) + '-'
    + tomorrow.getFullYear()
    const request = await axios.get('https://www.nordpoolgroup.com/api/marketdata/page/23?currency=NOK,NOK,EUR&endDate=' + tomorrowsDate)
    const d = request.data.data.Rows.map((item) => {
        let prices = item.Columns.filter((row) => {
            return row.Name === 'Kr.sand'
        }).map((obj) => {
            return parseFloat(obj.Value.replace(' ', '').replace(',','.'))
        })
        
        return {
            name: item.Name,
            start: item.StartTime,
            end: item.EndTime,
            price: prices
        }
    }).map((hour) => {
        return [hour.start, hour.price[0]]
    })
    if (d) {
        context.bindings.dailyprice = JSON.stringify({
            id: tomorrowsDate,
            prices: d.slice(0,24)
        })
        context.res = {
            body: JSON.stringify({
                id: tomorrowsDate,
                prices: d.slice(0,24)
            }),
            contentType: 'application/json'
        }
    }
    
    
}
