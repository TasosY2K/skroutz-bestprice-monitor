# skroutz-bestprice-monitor
I originally made this tool to be in the first who copped one of the new AMD 5000 series processors but i later realized that it can be used to monitor all products on [Skroutz](https://www.skroutz.gr) and [BestPrice](https://www.bestprice.gr) at the same time. If the product drops bellow a certain price you automatically get a message on Discord.

You can simply run it as any other NodeJS app:
- `git clone`
- `cd skroutz-bestprice-monitor`
- `npm install`
- `npm start`

Before running the monitor there is some configuration you must do in `index.js`
Everything is explained in the comments though so don't worry
I reccomend running this with pm2 and just leave it in a vm to do it's thing
Happy shopping :)

![Screenshot at 2020-12-09 05-03-54](https://user-images.githubusercontent.com/29873078/101569076-6f6dfe80-39dc-11eb-865e-ca4da98ac0ca.png)
