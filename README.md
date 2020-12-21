# ListenSomeMoe
It's a play on words.

ListenSomeMoe is a NodeJS listen.moe gateway only wrapper. That means that you cannot interact with the REST API listen.moe may provide (The public API didn't work at the time of writing this.)

# Basic Code Example
```js
const LSM = require("listensomemoe");

const jp = new LSM(LSM.Constants.baseJPOPGatewayURL);

jp
	// You MUST handle this error event or Node will yell at you if an error is ever emitted.
	// (or just straight kill your process if they ever actually deprecate unhandled error events)
	.on("error", console.error)
	.on("trackUpdate", console.log);

	// Example output of the data returned by trackUpdate:
	// {
	// 	id: 16821,
	// 	title: '光になれない',
	// 	sources: [],
	// 	artists: [
	// 		{
	// 			id: 2102,
	// 			name: 'ЯeaL',
	// 			nameRomaji: null,
	// 			image: 'ЯeaL_image.jpg',
	// 			characters: []
	// 		}
	// 	],
	// 	characters: [],
	// 	albums: [
	// 		{
	// 			id: 3321,
	// 			name: '未来コネクション',
	// 			nameRomaji: 'Mirai Connection',
	// 			image: '未来コネクション_cover.jpg'
	// 		}
	// 	],
	// 	duration: 260
	// }
```
