# Smallcase Portfolio Manager

A portfolio tracking app which allows you to add, update, delete trades, maintains holding details and can do basic return calculations. 
Portfolio is a grouping of financial assets such as stocks, bonds, commodities, currencies and cash equivalents, as well as their fund counterparts, including mutual,
exchange-traded and closed funds.

[Demo hosted on AWS](https://breakdance.github.io/breakdance/)

## Tech

* Node.js
* Express
* MongoDb

## Installation

Install the dependencies and devDependencies and start the server.
```sh
$ cd smallcase
$ npm install
$ npm start
````

## Plugins

* Lodash
* Moment

## APIS

### 1. Add Trade 

Add a trade to the portfolio for a given security, and update the portfolio. Trade could be of type BUY (1) or SELL(2).
For making a trade input params should be security(or ticker symbol), action (BUY or SELL), shares(or quantity), price(only in case of buy trade)

**URL** : `/trade`

**Method** : `POST`


#### Success Response

**Code** : `200 OK`

**Content examples**

Add a BUY(1) trade for security TCS with an average buy price of 1833.45 for a quantity of 5.

```json
{
	"ticker": "TCS",
	"action": 1,
	"shares": 5,
	"price": 1833.45
}
```

### 2. Update Trade 

Update a trade that was already made for a given security and action, and update the portfolio. Trade updation can only update the quantity and/or the price. If the security or action is to be modified in that case remove previously made trade and add a new trade.

**URL** : `/trade/:id`

**Method** : `PUT`
**Body** : {shares, price(in case of buy trade)}


#### Success Response

**Code** : `200 OK`

**Content examples**

Update a BUY(1) trade for security TCS with an average buy price of 400 for a quantity of 5.

```json
{
	"shares": 5,
	"price": 400
}
```
#### Notes

Trade updation can only update the quantity and/or the price because of the given reason -
* Security can't be updated if a trade is already made because it is one of a primary deciding feature in trade.
* The action (BUY/SELL) can't be updated because while adding a trade you are required to enter price for BUY action not for the SELL, therefore trade actions are verified there and are concrete.

### 3. Remove Trade 

Remove a trade that was already made for a given security, and update the portfolio.

**URL** : `/trade/:id`

**Method** : `DELETE`

#### Success Response

**Code** : `200 OK`

**Content examples**

Remove a trade with an id of `5f53c89c470bcb5af044ea0a`.

`/trade/5f53c89c470bcb5af044ea0a`

### 4. Fetch Portfolio

It returns all the securities and trades corresponding to it.

**URL** : `/portfolio`

**Method** : `GET`

#### Success Response

**Code** : `200 OK`

**Content examples**

`/portfolio`

**Sample Response**
```json
{
    "message": "Portfolio fetched successfully",
    "data": [
        {
            "tickerSymbol": "TCS",
            "trades": [
                {
                    "shares": 5,
                    "action": "BUY",
                    "price": 1833.45
                }
            ]
        }
    ]
}
```

### 5. Fetch Holdings

It returns an aggregate view of all securities in the portfolio with its final quantity and average buy price.

**URL** : `/holdings`

**Method** : `GET`

#### Success Response

**Code** : `200 OK`

**Content examples**

`/holdings`

**Sample Response**
```json
{
    "message": "Holdings fetched successfully",
    "data": [
        {
            "_id": "5f53c89c470bcb5af044ea0a",
            "tickerSymbol": "TCS",
            "shares": 5,
            "avgBuyPrice": 1833.45,
            "__v": 0
        },
        {
            "_id": "5f53c8e0470bcb5af044ea0c",
            "tickerSymbol": "WIPRO",
            "shares": 5,
            "avgBuyPrice": 319.25,
            "__v": 0
        },
        {
            "_id": "5f53c8f5470bcb5af044ea0e",
            "tickerSymbol": "GODREJIND",
            "shares": 2,
            "avgBuyPrice": 535,
            "__v": 0
        }
    ]
}
```

### 6. Fetch Returns

It returns cumulative returns at any point of time of a particular portfolio.

**URL** : `/returns`

**Method** : `GET`

#### Success Response

**Code** : `200 OK`

**Content examples**

`/returns`

**Sample Response**
```json
{
    "message": "Returns fetched successfully",
    "data": -10633.5
}
```
#### Notes

As per as the task definition, the current buy price is assumed to be fixed at 100.


