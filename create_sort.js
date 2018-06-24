const data = require('./data.json');
const lstData = [];
const mappingSymbol = {};
const mappingOrdId = {};

const time = new Date().getTime();

for (const itemSymbol in data) {
    const indexSymbol = lstData.length;
    if (!mappingSymbol[itemSymbol]) {
        lstData.push({
            symbol: itemSymbol,
            updated: 0,
            lstOrder: []
        });
        mappingSymbol[itemSymbol] = indexSymbol;
    }

    const objSymbol = lstData[indexSymbol];

    const listTran = data[itemSymbol].list_tran;
    if (listTran) {
        for (const itemTran of listTran) {
            let indexOrder = objSymbol.lstOrder.length - 1;
            if (!mappingOrdId[itemTran.broker_order_id]) {
                objSymbol.lstOrder.push({
                    updated: 0,
                    orderId: itemTran.broker_order_id,
                    listTran: []
                });
                indexOrder = objSymbol.lstOrder.length - 1;
                mappingOrdId[itemTran.broker_order_id] = indexOrder;
            }
            const objOrder = objSymbol.lstOrder[indexOrder];
            if (objSymbol.updated < itemTran.date) {
                objSymbol.updated = itemTran.date;
            }
            if (objOrder.updated < itemTran.date) {
                objOrder.updated = itemTran.date;
            }
            objOrder.listTran.push(itemTran);
        }
        for (const orderObj of objSymbol.lstOrder) {
            orderObj.listTran.sort((a, b) => b.brokerage - a.brokerage);
        }
        objSymbol.lstOrder.sort((a, b) => b.updated - a.updated);
    }
}

lstData.sort((a, b) => b.updated - a.updated);

console.log('Time ', new Date().getTime() - time);
