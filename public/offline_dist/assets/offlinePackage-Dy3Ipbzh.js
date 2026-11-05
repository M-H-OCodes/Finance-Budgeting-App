import{n as e,r as t,t as n}from"./index-BMPJc8pm.js";var r=t(n(((t,n)=>{(function(e){typeof t==`object`&&n!==void 0?n.exports=e():typeof define==`function`&&define.amd?define([],e):(typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:this).JSZip=e()})(function(){return function t(n,r,i){function a(s,c){if(!r[s]){if(!n[s]){var l=typeof e==`function`&&e;if(!c&&l)return l(s,!0);if(o)return o(s,!0);var u=Error(`Cannot find module '`+s+`'`);throw u.code=`MODULE_NOT_FOUND`,u}var d=r[s]={exports:{}};n[s][0].call(d.exports,function(e){var t=n[s][1][e];return a(t||e)},d,d.exports,t,n,r,i)}return r[s].exports}for(var o=typeof e==`function`&&e,s=0;s<i.length;s++)a(i[s]);return a}({1:[function(e,t,n){var r=e(`./utils`),i=e(`./support`),a=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`;n.encode=function(e){for(var t,n,i,o,s,c,l,u=[],d=0,f=e.length,p=f,m=r.getTypeOf(e)!==`string`;d<e.length;)p=f-d,i=m?(t=e[d++],n=d<f?e[d++]:0,d<f?e[d++]:0):(t=e.charCodeAt(d++),n=d<f?e.charCodeAt(d++):0,d<f?e.charCodeAt(d++):0),o=t>>2,s=(3&t)<<4|n>>4,c=1<p?(15&n)<<2|i>>6:64,l=2<p?63&i:64,u.push(a.charAt(o)+a.charAt(s)+a.charAt(c)+a.charAt(l));return u.join(``)},n.decode=function(e){var t,n,r,o,s,c,l=0,u=0,d=`data:`;if(e.substr(0,d.length)===d)throw Error(`Invalid base64 input, it looks like a data url.`);var f,p=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,``)).length/4;if(e.charAt(e.length-1)===a.charAt(64)&&p--,e.charAt(e.length-2)===a.charAt(64)&&p--,p%1!=0)throw Error(`Invalid base64 input, bad content length.`);for(f=i.uint8array?new Uint8Array(0|p):Array(0|p);l<e.length;)t=a.indexOf(e.charAt(l++))<<2|(o=a.indexOf(e.charAt(l++)))>>4,n=(15&o)<<4|(s=a.indexOf(e.charAt(l++)))>>2,r=(3&s)<<6|(c=a.indexOf(e.charAt(l++))),f[u++]=t,s!==64&&(f[u++]=n),c!==64&&(f[u++]=r);return f}},{"./support":30,"./utils":32}],2:[function(e,t,n){var r=e(`./external`),i=e(`./stream/DataWorker`),a=e(`./stream/Crc32Probe`),o=e(`./stream/DataLengthProbe`);function s(e,t,n,r,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=n,this.compression=r,this.compressedContent=i}s.prototype={getContentWorker:function(){var e=new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new o(`data_length`)),t=this;return e.on(`end`,function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw Error(`Bug : uncompressed data size mismatch`)}),e},getCompressedWorker:function(){return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo(`compressedSize`,this.compressedSize).withStreamInfo(`uncompressedSize`,this.uncompressedSize).withStreamInfo(`crc32`,this.crc32).withStreamInfo(`compression`,this.compression)}},s.createWorkerFrom=function(e,t,n){return e.pipe(new a).pipe(new o(`uncompressedSize`)).pipe(t.compressWorker(n)).pipe(new o(`compressedSize`)).withStreamInfo(`compression`,t)},t.exports=s},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,n){var r=e(`./stream/GenericWorker`);n.STORE={magic:`\0\0`,compressWorker:function(){return new r(`STORE compression`)},uncompressWorker:function(){return new r(`STORE decompression`)}},n.DEFLATE=e(`./flate`)},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,n){var r=e(`./utils`),i=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t){return e!==void 0&&e.length?r.getTypeOf(e)===`string`?function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t.charCodeAt(s))];return-1^e}(0|t,e,e.length,0):function(e,t,n,r){var a=i,o=r+n;e^=-1;for(var s=r;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,n){n.base64=!1,n.binary=!1,n.dir=!1,n.createFolders=!0,n.date=null,n.compression=null,n.compressionOptions=null,n.comment=null,n.unixPermissions=null,n.dosPermissions=null},{}],6:[function(e,t,n){var r=null;r=typeof Promise<`u`?Promise:e(`lie`),t.exports={Promise:r}},{lie:37}],7:[function(e,t,n){var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Uint32Array<`u`,i=e(`pako`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=r?`uint8array`:`array`;function c(e,t){o.call(this,`FlateWorker/`+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}n.magic=`\b\0`,a.inherits(c,o),c.prototype.processChunk=function(e){this.meta=e.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(s,e.data),!1)},c.prototype.flush=function(){o.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},c.prototype.cleanUp=function(){o.prototype.cleanUp.call(this),this._pako=null},c.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},n.compressWorker=function(e){return new c(`Deflate`,e)},n.uncompressWorker=function(){return new c(`Inflate`,{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,n){function r(e,t){var n,r=``;for(n=0;n<t;n++)r+=String.fromCharCode(255&e),e>>>=8;return r}function i(e,t,n,i,o,u){var d,f,p=e.file,m=e.compression,h=u!==s.utf8encode,g=a.transformTo(`string`,u(p.name)),_=a.transformTo(`string`,s.utf8encode(p.name)),v=p.comment,y=a.transformTo(`string`,u(v)),b=a.transformTo(`string`,s.utf8encode(v)),x=_.length!==p.name.length,S=b.length!==v.length,C=``,w=``,T=``,E=p.dir,D=p.date,O={crc32:0,compressedSize:0,uncompressedSize:0};t&&!n||(O.crc32=e.crc32,O.compressedSize=e.compressedSize,O.uncompressedSize=e.uncompressedSize);var k=0;t&&(k|=8),h||!x&&!S||(k|=2048);var A=0,j=0;E&&(A|=16),o===`UNIX`?(j=798,A|=function(e,t){var n=e;return e||(n=t?16893:33204),(65535&n)<<16}(p.unixPermissions,E)):(j=20,A|=function(e){return 63&(e||0)}(p.dosPermissions)),d=D.getUTCHours(),d<<=6,d|=D.getUTCMinutes(),d<<=5,d|=D.getUTCSeconds()/2,f=D.getUTCFullYear()-1980,f<<=4,f|=D.getUTCMonth()+1,f<<=5,f|=D.getUTCDate(),x&&(w=r(1,1)+r(c(g),4)+_,C+=`up`+r(w.length,2)+w),S&&(T=r(1,1)+r(c(y),4)+b,C+=`uc`+r(T.length,2)+T);var M=``;return M+=`
\0`,M+=r(k,2),M+=m.magic,M+=r(d,2),M+=r(f,2),M+=r(O.crc32,4),M+=r(O.compressedSize,4),M+=r(O.uncompressedSize,4),M+=r(g.length,2),M+=r(C.length,2),{fileRecord:l.LOCAL_FILE_HEADER+M+g+C,dirRecord:l.CENTRAL_FILE_HEADER+r(j,2)+M+r(y.length,2)+`\0\0\0\0`+r(A,4)+r(i,4)+g+C+y}}var a=e(`../utils`),o=e(`../stream/GenericWorker`),s=e(`../utf8`),c=e(`../crc32`),l=e(`../signature`);function u(e,t,n,r){o.call(this,`ZipFileWorker`),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=n,this.encodeFileName=r,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(u,o),u.prototype.push=function(e){var t=e.meta.percent||0,n=this.entriesCount,r=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,o.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:n?(t+100*(n-r-1))/n:100}}))},u.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var n=i(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:n.fileRecord,meta:{percent:0}})}else this.accumulate=!0},u.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,n=i(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(n.dirRecord),t)this.push({data:function(e){return l.DATA_DESCRIPTOR+r(e.crc32,4)+r(e.compressedSize,4)+r(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:n.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},u.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var n=this.bytesWritten-e,i=function(e,t,n,i,o){var s=a.transformTo(`string`,o(i));return l.CENTRAL_DIRECTORY_END+`\0\0\0\0`+r(e,2)+r(e,2)+r(t,4)+r(n,4)+r(s.length,2)+s}(this.dirRecords.length,n,e,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},u.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},u.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on(`error`,function(e){t.error(e)}),this},u.prototype.resume=function(){return!!o.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},u.prototype.error=function(e){var t=this._sources;if(!o.prototype.error.call(this,e))return!1;for(var n=0;n<t.length;n++)try{t[n].error(e)}catch{}return!0},u.prototype.lock=function(){o.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=u},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,n){var r=e(`../compressions`),i=e(`./ZipFileWorker`);n.generateWorker=function(e,t,n){var a=new i(t.streamFiles,n,t.platform,t.encodeFileName),o=0;try{e.forEach(function(e,n){o++;var i=function(e,t){var n=e||t,i=r[n];if(!i)throw Error(n+` is not a valid compression method !`);return i}(n.options.compression,t.compression),s=n.options.compressionOptions||t.compressionOptions||{},c=n.dir,l=n.date;n._compressWorker(i,s).withStreamInfo(`file`,{name:e,dir:c,date:l,comment:n.comment||``,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions}).pipe(a)}),a.entriesCount=o}catch(e){a.error(e)}return a}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,n){function r(){if(!(this instanceof r))return new r;if(arguments.length)throw Error(`The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.`);this.files=Object.create(null),this.comment=null,this.root=``,this.clone=function(){var e=new r;for(var t in this)typeof this[t]!=`function`&&(e[t]=this[t]);return e}}(r.prototype=e(`./object`)).loadAsync=e(`./load`),r.support=e(`./support`),r.defaults=e(`./defaults`),r.version=`3.10.2`,r.loadAsync=function(e,t){return new r().loadAsync(e,t)},r.external=e(`./external`),t.exports=r},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,n){var r=e(`./utils`),i=e(`./external`),a=e(`./utf8`),o=e(`./zipEntries`),s=e(`./stream/Crc32Probe`),c=e(`./nodejsUtils`);function l(e){return new i.Promise(function(t,n){var r=e.decompressed.getContentWorker().pipe(new s);r.on(`error`,function(e){n(e)}).on(`end`,function(){r.streamInfo.crc32===e.decompressed.crc32?t():n(Error(`Corrupted zip : CRC32 mismatch`))}).resume()})}t.exports=function(e,t){var n=this;return t=r.extend(t||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),c.isNode&&c.isStream(e)?i.Promise.reject(Error(`JSZip can't accept a stream when loading a zip file.`)):r.prepareContent(`the loaded zip file`,e,!0,t.optimizedBinaryString,t.base64).then(function(e){var n=new o(t);return n.load(e),n}).then(function(e){var n=[i.Promise.resolve(e)],r=e.files;if(t.checkCRC32)for(var a=0;a<r.length;a++)n.push(l(r[a]));return i.Promise.all(n)}).then(function(e){for(var i=e.shift(),a=i.files,o=0;o<a.length;o++){var s=a[o],c=s.fileNameStr,l=r.resolve(s.fileNameStr);n.file(l,s.decompressed,{binary:!0,optimizedBinaryString:!0,date:s.date,dir:s.dir,comment:s.fileCommentStr.length?s.fileCommentStr:null,unixPermissions:s.unixPermissions,dosPermissions:s.dosPermissions,createFolders:t.createFolders}),s.dir||(n.file(l).unsafeOriginalName=c)}return i.zipComment.length&&(n.comment=i.zipComment),n})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,n){var r=e(`../utils`),i=e(`../stream/GenericWorker`);function a(e,t){i.call(this,`Nodejs stream input adapter for `+e),this._upstreamEnded=!1,this._bindStream(t)}r.inherits(a,i),a.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on(`data`,function(e){t.push({data:e,meta:{percent:0}})}).on(`error`,function(e){t.isPaused?this.generatedError=e:t.error(e)}).on(`end`,function(){t.isPaused?t._upstreamEnded=!0:t.end()})},a.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,n){var r=e(`readable-stream`).Readable;function i(e,t,n){r.call(this,t),this._helper=e;var i=this;e.on(`data`,function(e,t){i.push(e)||i._helper.pause(),n&&n(t)}).on(`error`,function(e){i.emit(`error`,e)}).on(`end`,function(){i.push(null)})}e(`../utils`).inherits(i,r),i.prototype._read=function(){this._helper.resume()},t.exports=i},{"../utils":32,"readable-stream":16}],14:[function(e,t,n){t.exports={isNode:typeof Buffer<`u`,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if(typeof e==`number`)throw Error(`The "data" argument must not be a number`);return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&typeof e.on==`function`&&typeof e.pause==`function`&&typeof e.resume==`function`}}},{}],15:[function(e,t,n){function r(e,t,n){var r,i=a.getTypeOf(t),s=a.extend(n||{},c);s.date=s.date||new Date,s.compression!==null&&(s.compression=s.compression.toUpperCase()),typeof s.unixPermissions==`string`&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=h(e)),s.createFolders&&(r=m(e))&&g.call(this,r,!0);var d=i===`string`&&!1===s.binary&&!1===s.base64;n&&n.binary!==void 0||(s.binary=!d),(t instanceof l&&t.uncompressedSize===0||s.dir||!t||t.length===0)&&(s.base64=!1,s.binary=!0,t=``,s.compression=`STORE`,i=`string`);var _=null;_=t instanceof l||t instanceof o?t:f.isNode&&f.isStream(t)?new p(e,t):a.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var v=new u(e,_,s);this.files[e]=v}var i=e(`./utf8`),a=e(`./utils`),o=e(`./stream/GenericWorker`),s=e(`./stream/StreamHelper`),c=e(`./defaults`),l=e(`./compressedObject`),u=e(`./zipObject`),d=e(`./generate`),f=e(`./nodejsUtils`),p=e(`./nodejs/NodejsStreamInputAdapter`),m=function(e){e.slice(-1)===`/`&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf(`/`);return 0<t?e.substring(0,t):``},h=function(e){return e.slice(-1)!==`/`&&(e+=`/`),e},g=function(e,t){return t=t===void 0?c.createFolders:t,e=h(e),this.files[e]||r.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function _(e){return Object.prototype.toString.call(e)===`[object RegExp]`}t.exports={load:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},forEach:function(e){var t,n,r;for(t in this.files)r=this.files[t],(n=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(n,r)},filter:function(e){var t=[];return this.forEach(function(n,r){e(n,r)&&t.push(r)}),t},file:function(e,t,n){if(arguments.length!==1)return e=this.root+e,r.call(this,e,t,n),this;if(_(e)){var i=e;return this.filter(function(e,t){return!t.dir&&i.test(e)})}var a=this.files[this.root+e];return a&&!a.dir?a:null},folder:function(e){if(!e)return this;if(_(e))return this.filter(function(t,n){return n.dir&&e.test(t)});var t=this.root+e,n=g.call(this,t),r=this.clone();return r.root=n.name,r},remove:function(e){e=this.root+e;var t=this.files[e];if(t||=(e.slice(-1)!==`/`&&(e+=`/`),this.files[e]),t&&!t.dir)delete this.files[e];else for(var n=this.filter(function(t,n){return n.name.slice(0,e.length)===e}),r=0;r<n.length;r++)delete this.files[n[r].name];return this},generate:function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},generateInternalStream:function(e){var t,n={};try{if((n=a.extend(e||{},{streamFiles:!1,compression:`STORE`,compressionOptions:null,type:``,platform:`DOS`,comment:null,mimeType:`application/zip`,encodeFileName:i.utf8encode})).type=n.type.toLowerCase(),n.compression=n.compression.toUpperCase(),n.type===`binarystring`&&(n.type=`string`),!n.type)throw Error(`No output type specified.`);a.checkSupport(n.type),n.platform!==`darwin`&&n.platform!==`freebsd`&&n.platform!==`linux`&&n.platform!==`sunos`||(n.platform=`UNIX`),n.platform===`win32`&&(n.platform=`DOS`);var r=n.comment||this.comment||``;t=d.generateWorker(this,n,r)}catch(e){(t=new o(`error`)).error(e)}return new s(t,n.type||`string`,n.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e||={}).type||(e.type=`nodebuffer`),this.generateInternalStream(e).toNodejsStream(t)}}},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,n){t.exports=e(`stream`)},{stream:void 0}],17:[function(e,t,n){var r=e(`./DataReader`);function i(e){r.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.length-4;0<=a;--a)if(this.data[a]===t&&this.data[a+1]===n&&this.data[a+2]===r&&this.data[a+3]===i)return a-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),n=e.charCodeAt(1),r=e.charCodeAt(2),i=e.charCodeAt(3),a=this.readData(4);return t===a[0]&&n===a[1]&&r===a[2]&&i===a[3]},i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,n){var r=e(`../utils`);function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw Error(`End of data reached (data length = `+this.length+`, asked index = `+e+`). Corrupted zip ?`)},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,n=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)n=(n<<8)+this.byteAt(t);return this.index+=e,n},readString:function(e){return r.transformTo(`string`,this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,n){var r=e(`./Uint8ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,n){var r=e(`./DataReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,n){var r=e(`./ArrayReader`);function i(e){r.call(this,e)}e(`../utils`).inherits(i,r),i.prototype.readData=function(e){if(this.checkOffset(e),e===0)return new Uint8Array;var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,n){var r=e(`../utils`),i=e(`../support`),a=e(`./ArrayReader`),o=e(`./StringReader`),s=e(`./NodeBufferReader`),c=e(`./Uint8ArrayReader`);t.exports=function(e){var t=r.getTypeOf(e);return r.checkSupport(t),t!==`string`||i.uint8array?t===`nodebuffer`?new s(e):i.uint8array?new c(r.transformTo(`uint8array`,e)):new a(r.transformTo(`array`,e)):new o(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,n){n.LOCAL_FILE_HEADER=`PK`,n.CENTRAL_FILE_HEADER=`PK`,n.CENTRAL_DIRECTORY_END=`PK`,n.ZIP64_CENTRAL_DIRECTORY_LOCATOR=`PK\x07`,n.ZIP64_CENTRAL_DIRECTORY_END=`PK`,n.DATA_DESCRIPTOR=`PK\x07\b`},{}],24:[function(e,t,n){var r=e(`./GenericWorker`),i=e(`../utils`);function a(e){r.call(this,`ConvertWorker to `+e),this.destType=e}i.inherits(a,r),a.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,n){var r=e(`./GenericWorker`),i=e(`../crc32`);function a(){r.call(this,`Crc32Probe`),this.withStreamInfo(`crc32`,0)}e(`../utils`).inherits(a,r),a.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,n){var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataLengthProbe for `+e),this.propName=e,this.withStreamInfo(e,0)}r.inherits(a,i),a.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,n){var r=e(`../utils`),i=e(`./GenericWorker`);function a(e){i.call(this,`DataWorker`);var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type=``,this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=r.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}r.inherits(a,i),a.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,r.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(r.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case`string`:e=this.data.substring(this.index,t);break;case`uint8array`:e=this.data.subarray(this.index,t);break;case`array`:case`nodebuffer`:e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,n){function r(e){this.name=e||`default`,this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}r.prototype={push:function(e){this.emit(`data`,e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit(`end`),this.cleanUp(),this.isFinished=!0}catch(e){this.emit(`error`,e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit(`error`,e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var n=0;n<this._listeners[e].length;n++)this._listeners[e][n].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on(`data`,function(e){t.processChunk(e)}),e.on(`end`,function(){t.end()}),e.on(`error`,function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw Error(`The stream '`+this+`' has already been used.`);this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e=`Worker `+this.name;return this.previous?this.previous+` -> `+e:e}},t.exports=r},{}],29:[function(e,t,n){var r=e(`../utils`),i=e(`./ConvertWorker`),a=e(`./GenericWorker`),o=e(`../base64`),s=e(`../support`),c=e(`../external`),l=null;if(s.nodestream)try{l=e(`../nodejs/NodejsStreamOutputAdapter`)}catch{}function u(e,t){return new c.Promise(function(n,i){var a=[],s=e._internalType,c=e._outputType,l=e._mimeType;e.on(`data`,function(e,n){a.push(e),t&&t(n)}).on(`error`,function(e){a=[],i(e)}).on(`end`,function(){try{n(function(e,t,n){switch(e){case`blob`:return r.newBlob(r.transformTo(`arraybuffer`,t),n);case`base64`:return o.encode(t);default:return r.transformTo(e,t)}}(c,function(e,t){var n,r=0,i=null,a=0;for(n=0;n<t.length;n++)a+=t[n].length;switch(e){case`string`:return t.join(``);case`array`:return Array.prototype.concat.apply([],t);case`uint8array`:for(i=new Uint8Array(a),n=0;n<t.length;n++)i.set(t[n],r),r+=t[n].length;return i;case`nodebuffer`:return Buffer.concat(t);default:throw Error(`concat : unsupported type '`+e+`'`)}}(s,a),l))}catch(e){i(e)}a=[]}).resume()})}function d(e,t,n){var o=t;switch(t){case`blob`:case`arraybuffer`:o=`uint8array`;break;case`base64`:o=`string`}try{this._internalType=o,this._outputType=t,this._mimeType=n,r.checkSupport(o),this._worker=e.pipe(new i(o)),e.lock()}catch(e){this._worker=new a(`error`),this._worker.error(e)}}d.prototype={accumulate:function(e){return u(this,e)},on:function(e,t){var n=this;return e===`data`?this._worker.on(e,function(e){t.call(n,e.data,e.meta)}):this._worker.on(e,function(){r.delay(t,arguments,n)}),this},resume:function(){return r.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(r.checkSupport(`nodestream`),this._outputType!==`nodebuffer`)throw Error(this._outputType+` is not supported by this method`);return new l(this,{objectMode:this._outputType!==`nodebuffer`},e)}},t.exports=d},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,n){if(n.base64=!0,n.array=!0,n.string=!0,n.arraybuffer=typeof ArrayBuffer<`u`&&typeof Uint8Array<`u`,n.nodebuffer=typeof Buffer<`u`,n.uint8array=typeof Uint8Array<`u`,typeof ArrayBuffer>`u`)n.blob=!1;else{var r=new ArrayBuffer(0);try{n.blob=new Blob([r],{type:`application/zip`}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(r),n.blob=i.getBlob(`application/zip`).size===0}catch{n.blob=!1}}}try{n.nodestream=!!e(`readable-stream`).Readable}catch{n.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,n){for(var r=e(`./utils`),i=e(`./support`),a=e(`./nodejsUtils`),o=e(`./stream/GenericWorker`),s=Array(256),c=0;c<256;c++)s[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;s[254]=s[254]=1;function l(){o.call(this,`utf-8 decode`),this.leftOver=null}function u(){o.call(this,`utf-8 encode`)}n.utf8encode=function(e){return i.nodebuffer?a.newBufferFrom(e,`utf-8`):function(e){var t,n,r,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=i.uint8array?new Uint8Array(c):Array(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(r=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(r-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t}(e)},n.utf8decode=function(e){return i.nodebuffer?r.transformTo(`nodebuffer`,e).toString(`utf-8`):function(e){var t,n,i,a,o=e.length,c=Array(2*o);for(t=n=0;t<o;)if((i=e[t++])<128)c[n++]=i;else if(4<(a=s[i]))c[n++]=65533,t+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&t<o;)i=i<<6|63&e[t++],a--;1<a?c[n++]=65533:i<65536?c[n++]=i:(i-=65536,c[n++]=55296|i>>10&1023,c[n++]=56320|1023&i)}return c.length!==n&&(c.subarray?c=c.subarray(0,n):c.length=n),r.applyFromCharCode(c)}(e=r.transformTo(i.uint8array?`uint8array`:`array`,e))},r.inherits(l,o),l.prototype.processChunk=function(e){var t=r.transformTo(i.uint8array?`uint8array`:`array`,e.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var a=t;(t=new Uint8Array(a.length+this.leftOver.length)).set(this.leftOver,0),t.set(a,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var o=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+s[e[n]]>t?n:t}(t),c=t;o!==t.length&&(i.uint8array?(c=t.subarray(0,o),this.leftOver=t.subarray(o,t.length)):(c=t.slice(0,o),this.leftOver=t.slice(o,t.length))),this.push({data:n.utf8decode(c),meta:e.meta})},l.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:n.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},n.Utf8DecodeWorker=l,r.inherits(u,o),u.prototype.processChunk=function(e){this.push({data:n.utf8encode(e.data),meta:e.meta})},n.Utf8EncodeWorker=u},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,n){var r=e(`./support`),i=e(`./base64`),a=e(`./nodejsUtils`),o=e(`./external`);function s(e){return e}function c(e,t){for(var n=0;n<e.length;++n)t[n]=255&e.charCodeAt(n);return t}e(`setimmediate`),n.newBlob=function(e,t){n.checkSupport(`blob`);try{return new Blob([e],{type:t})}catch{try{var r=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return r.append(e),r.getBlob(t)}catch{throw Error(`Bug : can't construct the Blob.`)}}};var l={stringifyByChunk:function(e,t,n){var r=[],i=0,a=e.length;if(a<=n)return String.fromCharCode.apply(null,e);for(;i<a;)t===`array`||t===`nodebuffer`?r.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+n,a)))):r.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+n,a)))),i+=n;return r.join(``)},stringifyByChar:function(e){for(var t=``,n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t},applyCanBeUsed:{uint8array:function(){try{return r.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return r.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function u(e){var t=65536,r=n.getTypeOf(e),i=!0;if(r===`uint8array`?i=l.applyCanBeUsed.uint8array:r===`nodebuffer`&&(i=l.applyCanBeUsed.nodebuffer),i)for(;1<t;)try{return l.stringifyByChunk(e,r,t)}catch{t=Math.floor(t/2)}return l.stringifyByChar(e)}function d(e,t){for(var n=0;n<e.length;n++)t[n]=e[n];return t}n.applyFromCharCode=u;var f={};f.string={string:s,array:function(e){return c(e,Array(e.length))},arraybuffer:function(e){return f.string.uint8array(e).buffer},uint8array:function(e){return c(e,new Uint8Array(e.length))},nodebuffer:function(e){return c(e,a.allocBuffer(e.length))}},f.array={string:u,array:s,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(e)}},f.arraybuffer={string:function(e){return u(new Uint8Array(e))},array:function(e){return d(new Uint8Array(e),Array(e.byteLength))},arraybuffer:s,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return a.newBufferFrom(new Uint8Array(e))}},f.uint8array={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:s,nodebuffer:function(e){return a.newBufferFrom(e)}},f.nodebuffer={string:u,array:function(e){return d(e,Array(e.length))},arraybuffer:function(e){return f.nodebuffer.uint8array(e).buffer},uint8array:function(e){return d(e,new Uint8Array(e.length))},nodebuffer:s},n.transformTo=function(e,t){return t||=``,e?(n.checkSupport(e),f[n.getTypeOf(t)][e](t)):t},n.resolve=function(e){for(var t=e.split(`/`),n=[],r=0;r<t.length;r++){var i=t[r];i===`.`||i===``&&r!==0&&r!==t.length-1||(i===`..`?n.pop():n.push(i))}return n.join(`/`)},n.getTypeOf=function(e){if(typeof e==`string`)return`string`;var t=Object.prototype.toString.call(e);return t===`[object Array]`?`array`:r.nodebuffer&&a.isBuffer(e)?`nodebuffer`:r.uint8array&&t===`[object Uint8Array]`?`uint8array`:r.arraybuffer&&t===`[object ArrayBuffer]`?`arraybuffer`:void 0},n.checkSupport=function(e){if(!r[e.toLowerCase()])throw Error(e+` is not supported by this platform`)},n.MAX_VALUE_16BITS=65535,n.MAX_VALUE_32BITS=-1,n.pretty=function(e){var t,n,r=``;for(n=0;n<(e||``).length;n++)r+=`\\x`+((t=e.charCodeAt(n))<16?`0`:``)+t.toString(16).toUpperCase();return r},n.delay=function(e,t,n){setImmediate(function(){e.apply(n||null,t||[])})},n.inherits=function(e,t){function n(){}n.prototype=t.prototype,e.prototype=new n},n.extend=function(){var e,t,n={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&n[t]===void 0&&(n[t]=arguments[e][t]);return n},n.prepareContent=function(e,t,a,s,l){return o.Promise.resolve(t).then(function(t){return r.blob&&(t instanceof Blob||[`[object File]`,`[object Blob]`].indexOf(Object.prototype.toString.call(t))!==-1)?Blob.prototype.arrayBuffer===void 0?typeof FileReader<`u`?new o.Promise(function(e,n){var r=new FileReader;r.onload=function(t){e(t.target.result)},r.onerror=function(e){n(e.target.error)},r.readAsArrayBuffer(t)}):o.Promise.reject(Error(e+` is a Blob, but we have no way of reading it.`)):t.arrayBuffer():t}).then(function(t){var u=n.getTypeOf(t);return u?(u===`arraybuffer`?t=n.transformTo(`uint8array`,t):u===`string`&&(l?t=i.decode(t):a&&!0!==s&&(t=function(e){return c(e,r.uint8array?new Uint8Array(e.length):Array(e.length))}(t))),t):o.Promise.reject(Error(`Can't read the data of '`+e+`'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?`))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,n){var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./signature`),o=e(`./zipEntry`),s=e(`./support`);function c(e){this.files=[],this.loadOptions=e}c.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw Error(`Corrupted zip or bug: unexpected signature (`+i.pretty(t)+`, expected `+i.pretty(e)+`)`)}},isSignature:function(e,t){var n=this.reader.index;this.reader.setIndex(e);var r=this.reader.readString(4)===t;return this.reader.setIndex(n),r},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=s.uint8array?`uint8array`:`array`,n=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(n)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,n,r=this.zip64EndOfCentralSize-44;0<r;)e=this.reader.readInt(2),t=this.reader.readInt(4),n=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:n}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw Error(`Multi-volumes zip are not supported`)},readLocalFiles:function(){for(var e=0,t;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(e=new o({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw Error(`Corrupted zip or bug: expected `+this.centralDirRecords+` records in central dir, got `+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(e<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?Error(`Corrupted zip: can't find end of central directory`):Error(`Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html`);this.reader.setIndex(e);var t=e;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw Error(`Corrupted zip: can't find the ZIP64 end of central directory locator`);if(this.reader.setIndex(e),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw Error(`Corrupted zip: can't find the ZIP64 end of central directory`);this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var n=this.centralDirOffset+this.centralDirSize;this.zip64&&(n+=20,n+=12+this.zip64EndOfCentralSize);var r=t-n;if(0<r)this.isSignature(t,a.CENTRAL_FILE_HEADER)||(this.reader.zero=r);else if(r<0)throw Error(`Corrupted zip: missing `+Math.abs(r)+` bytes.`)},prepareReader:function(e){this.reader=r(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=c},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,n){var r=e(`./reader/readerFor`),i=e(`./utils`),a=e(`./compressedObject`),o=e(`./crc32`),s=e(`./utf8`),c=e(`./compressions`),l=e(`./support`);function u(e,t){this.options=e,this.loadOptions=t}u.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(e){var t,n;if(e.skip(22),this.fileNameLength=e.readInt(2),n=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(n),this.compressedSize===-1||this.uncompressedSize===-1)throw Error(`Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)`);if((t=function(e){for(var t in c)if(Object.prototype.hasOwnProperty.call(c,t)&&c[t].magic===e)return c[t];return null}(this.compressionMethod))===null)throw Error(`Corrupted zip : compression `+i.pretty(this.compressionMethod)+` unknown (inner file : `+i.transformTo(`string`,this.fileName)+`)`);this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw Error(`Encrypted zip are not supported`);e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),e==0&&(this.dosPermissions=63&this.externalFileAttributes),e==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!==`/`||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=r(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,n,r,i=e.index+this.extraFieldsLength;for(this.extraFields||={};e.index+4<i;)t=e.readInt(2),n=e.readInt(2),r=e.readData(n),this.extraFields[t]={id:t,length:n,value:r};e.setIndex(i)},handleUTF8:function(){var e=l.uint8array?`uint8array`:`array`;if(this.useUTF8())this.fileNameStr=s.utf8decode(this.fileName),this.fileCommentStr=s.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(t!==null)this.fileNameStr=t;else{var n=i.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(n)}var r=this.findExtraFieldUnicodeComment();if(r!==null)this.fileCommentStr=r;else{var a=i.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(a)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileName)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=r(e.value);return t.readInt(1)===1&&o(this.fileComment)===t.readInt(4)?s.utf8decode(t.readData(e.length-5)):null}return null}},t.exports=u},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,n){function r(e,t,n){this.name=e,this.dir=n.dir,this.date=n.date,this.comment=n.comment,this.unixPermissions=n.unixPermissions,this.dosPermissions=n.dosPermissions,this._data=t,this._dataBinary=n.binary,this.options={compression:n.compression,compressionOptions:n.compressionOptions}}var i=e(`./stream/StreamHelper`),a=e(`./stream/DataWorker`),o=e(`./utf8`),s=e(`./compressedObject`),c=e(`./stream/GenericWorker`);r.prototype={internalStream:function(e){var t=null,n=`string`;try{if(!e)throw Error(`No output type specified.`);var r=(n=e.toLowerCase())===`string`||n===`text`;n!==`binarystring`&&n!==`text`||(n=`string`),t=this._decompressWorker();var a=!this._dataBinary;a&&!r&&(t=t.pipe(new o.Utf8EncodeWorker)),!a&&r&&(t=t.pipe(new o.Utf8DecodeWorker))}catch(e){(t=new c(`error`)).error(e)}return new i(t,n,``)},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||`nodebuffer`).toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof s&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var n=this._decompressWorker();return this._dataBinary||(n=n.pipe(new o.Utf8EncodeWorker)),s.createWorkerFrom(n,e,t)},_decompressWorker:function(){return this._data instanceof s?this._data.getContentWorker():this._data instanceof c?this._data:new a(this._data)}};for(var l=[`asText`,`asBinary`,`asNodeBuffer`,`asUint8Array`,`asArrayBuffer`],u=function(){throw Error(`This method has been removed in JSZip 3.0, please check the upgrade guide.`)},d=0;d<l.length;d++)r.prototype[l[d]]=u;t.exports=r},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,t,n){(function(e){var n,r,i=e.MutationObserver||e.WebKitMutationObserver;if(i){var a=0,o=new i(u),s=e.document.createTextNode(``);o.observe(s,{characterData:!0}),n=function(){s.data=a=++a%2}}else if(e.setImmediate||e.MessageChannel===void 0)n=`document`in e&&`onreadystatechange`in e.document.createElement(`script`)?function(){var t=e.document.createElement(`script`);t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var c=new e.MessageChannel;c.port1.onmessage=u,n=function(){c.port2.postMessage(0)}}var l=[];function u(){var e,t;r=!0;for(var n=l.length;n;){for(t=l,l=[],e=-1;++e<n;)t[e]();n=l.length}r=!1}t.exports=function(e){l.push(e)!==1||r||n()}}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}],37:[function(e,t,n){var r=e(`immediate`);function i(){}var a={},o=[`REJECTED`],s=[`FULFILLED`],c=[`PENDING`];function l(e){if(typeof e!=`function`)throw TypeError(`resolver must be a function`);this.state=c,this.queue=[],this.outcome=void 0,e!==i&&p(this,e)}function u(e,t,n){this.promise=e,typeof t==`function`&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),typeof n==`function`&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function d(e,t,n){r(function(){var r;try{r=t(n)}catch(t){return a.reject(e,t)}r===e?a.reject(e,TypeError(`Cannot resolve promise with itself`)):a.resolve(e,r)})}function f(e){var t=e&&e.then;if(e&&(typeof e==`object`||typeof e==`function`)&&typeof t==`function`)return function(){t.apply(e,arguments)}}function p(e,t){var n=!1;function r(t){n||(n=!0,a.reject(e,t))}function i(t){n||(n=!0,a.resolve(e,t))}var o=m(function(){t(i,r)});o.status===`error`&&r(o.value)}function m(e,t){var n={};try{n.value=e(t),n.status=`success`}catch(e){n.status=`error`,n.value=e}return n}(t.exports=l).prototype.finally=function(e){if(typeof e!=`function`)return this;var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},l.prototype.catch=function(e){return this.then(null,e)},l.prototype.then=function(e,t){if(typeof e!=`function`&&this.state===s||typeof t!=`function`&&this.state===o)return this;var n=new this.constructor(i);return this.state===c?this.queue.push(new u(n,e,t)):d(n,this.state===s?e:t,this.outcome),n},u.prototype.callFulfilled=function(e){a.resolve(this.promise,e)},u.prototype.otherCallFulfilled=function(e){d(this.promise,this.onFulfilled,e)},u.prototype.callRejected=function(e){a.reject(this.promise,e)},u.prototype.otherCallRejected=function(e){d(this.promise,this.onRejected,e)},a.resolve=function(e,t){var n=m(f,t);if(n.status===`error`)return a.reject(e,n.value);var r=n.value;if(r)p(e,r);else{e.state=s,e.outcome=t;for(var i=-1,o=e.queue.length;++i<o;)e.queue[i].callFulfilled(t)}return e},a.reject=function(e,t){e.state=o,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},l.resolve=function(e){return e instanceof this?e:a.resolve(new this(i),e)},l.reject=function(e){var t=new this(i);return a.reject(t,e)},l.all=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=Array(n),s=0,c=-1,l=new this(i);++c<n;)u(e[c],c);return l;function u(e,i){t.resolve(e).then(function(e){o[i]=e,++s!==n||r||(r=!0,a.resolve(l,o))},function(e){r||(r=!0,a.reject(l,e))})}},l.race=function(e){var t=this;if(Object.prototype.toString.call(e)!==`[object Array]`)return this.reject(TypeError(`must be an array`));var n=e.length,r=!1;if(!n)return this.resolve([]);for(var o=-1,s=new this(i);++o<n;)c=e[o],t.resolve(c).then(function(e){r||(r=!0,a.resolve(s,e))},function(e){r||(r=!0,a.reject(s,e))});var c;return s}},{immediate:36}],38:[function(e,t,n){var r={};(0,e(`./lib/utils/common`).assign)(r,e(`./lib/deflate`),e(`./lib/inflate`),e(`./lib/zlib/constants`)),t.exports=r},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,n){var r=e(`./zlib/deflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/messages`),s=e(`./zlib/zstream`),c=Object.prototype.toString,l=0,u=-1,d=0,f=8;function p(e){if(!(this instanceof p))return new p(e);this.options=i.assign({level:u,method:f,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:``},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var n=r.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(n!==l)throw Error(o[n]);if(t.header&&r.deflateSetHeader(this.strm,t.header),t.dictionary){var m=typeof t.dictionary==`string`?a.string2buf(t.dictionary):c.call(t.dictionary)===`[object ArrayBuffer]`?new Uint8Array(t.dictionary):t.dictionary;if((n=r.deflateSetDictionary(this.strm,m))!==l)throw Error(o[n]);this._dict_set=!0}}function m(e,t){var n=new p(t);if(n.push(e,!0),n.err)throw n.msg||o[n.err];return n.result}p.prototype.push=function(e,t){var n,o,s=this.strm,u=this.options.chunkSize;if(this.ended)return!1;o=t===~~t?t:!0===t?4:0,s.input=typeof e==`string`?a.string2buf(e):c.call(e)===`[object ArrayBuffer]`?new Uint8Array(e):e,s.next_in=0,s.avail_in=s.input.length;do{if(s.avail_out===0&&(s.output=new i.Buf8(u),s.next_out=0,s.avail_out=u),(n=r.deflate(s,o))!==1&&n!==l)return this.onEnd(n),!(this.ended=!0);s.avail_out!==0&&(s.avail_in!==0||o!==4&&o!==2)||(this.options.to===`string`?this.onData(a.buf2binstring(i.shrinkBuf(s.output,s.next_out))):this.onData(i.shrinkBuf(s.output,s.next_out)))}while((0<s.avail_in||s.avail_out===0)&&n!==1);return o===4?(n=r.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===l):o!==2||(this.onEnd(l),!(s.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&(this.result=this.options.to===`string`?this.chunks.join(``):i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Deflate=p,n.deflate=m,n.deflateRaw=function(e,t){return(t||={}).raw=!0,m(e,t)},n.gzip=function(e,t){return(t||={}).gzip=!0,m(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,n){var r=e(`./zlib/inflate`),i=e(`./utils/common`),a=e(`./utils/strings`),o=e(`./zlib/constants`),s=e(`./zlib/messages`),c=e(`./zlib/zstream`),l=e(`./zlib/gzheader`),u=Object.prototype.toString;function d(e){if(!(this instanceof d))return new d(e);this.options=i.assign({chunkSize:16384,windowBits:0,to:``},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,t.windowBits===0&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&!(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg=``,this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var n=r.inflateInit2(this.strm,t.windowBits);if(n!==o.Z_OK)throw Error(s[n]);this.header=new l,r.inflateGetHeader(this.strm,this.header)}function f(e,t){var n=new d(t);if(n.push(e,!0),n.err)throw n.msg||s[n.err];return n.result}d.prototype.push=function(e,t){var n,s,c,l,d,f,p=this.strm,m=this.options.chunkSize,h=this.options.dictionary,g=!1;if(this.ended)return!1;s=t===~~t?t:!0===t?o.Z_FINISH:o.Z_NO_FLUSH,p.input=typeof e==`string`?a.binstring2buf(e):u.call(e)===`[object ArrayBuffer]`?new Uint8Array(e):e,p.next_in=0,p.avail_in=p.input.length;do{if(p.avail_out===0&&(p.output=new i.Buf8(m),p.next_out=0,p.avail_out=m),(n=r.inflate(p,o.Z_NO_FLUSH))===o.Z_NEED_DICT&&h&&(f=typeof h==`string`?a.string2buf(h):u.call(h)===`[object ArrayBuffer]`?new Uint8Array(h):h,n=r.inflateSetDictionary(this.strm,f)),n===o.Z_BUF_ERROR&&!0===g&&(n=o.Z_OK,g=!1),n!==o.Z_STREAM_END&&n!==o.Z_OK)return this.onEnd(n),!(this.ended=!0);p.next_out&&(p.avail_out!==0&&n!==o.Z_STREAM_END&&(p.avail_in!==0||s!==o.Z_FINISH&&s!==o.Z_SYNC_FLUSH)||(this.options.to===`string`?(c=a.utf8border(p.output,p.next_out),l=p.next_out-c,d=a.buf2string(p.output,c),p.next_out=l,p.avail_out=m-l,l&&i.arraySet(p.output,p.output,c,l,0),this.onData(d)):this.onData(i.shrinkBuf(p.output,p.next_out)))),p.avail_in===0&&p.avail_out===0&&(g=!0)}while((0<p.avail_in||p.avail_out===0)&&n!==o.Z_STREAM_END);return n===o.Z_STREAM_END&&(s=o.Z_FINISH),s===o.Z_FINISH?(n=r.inflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===o.Z_OK):s!==o.Z_SYNC_FLUSH||(this.onEnd(o.Z_OK),!(p.avail_out=0))},d.prototype.onData=function(e){this.chunks.push(e)},d.prototype.onEnd=function(e){e===o.Z_OK&&(this.result=this.options.to===`string`?this.chunks.join(``):i.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},n.Inflate=d,n.inflate=f,n.inflateRaw=function(e,t){return(t||={}).raw=!0,f(e,t)},n.ungzip=f},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,n){var r=typeof Uint8Array<`u`&&typeof Uint16Array<`u`&&typeof Int32Array<`u`;n.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var n=t.shift();if(n){if(typeof n!=`object`)throw TypeError(n+`must be non-object`);for(var r in n)n.hasOwnProperty(r)&&(e[r]=n[r])}}return e},n.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,n,r,i){if(t.subarray&&e.subarray)e.set(t.subarray(n,n+r),i);else for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){for(var t=r=0,n=e.length,r,i,a,o;t<n;t++)r+=e[t].length;for(o=new Uint8Array(r),t=i=0,n=e.length;t<n;t++)a=e[t],o.set(a,i),i+=a.length;return o}},a={arraySet:function(e,t,n,r,i){for(var a=0;a<r;a++)e[i+a]=t[n+a]},flattenChunks:function(e){return[].concat.apply([],e)}};n.setTyped=function(e){e?(n.Buf8=Uint8Array,n.Buf16=Uint16Array,n.Buf32=Int32Array,n.assign(n,i)):(n.Buf8=Array,n.Buf16=Array,n.Buf32=Array,n.assign(n,a))},n.setTyped(r)},{}],42:[function(e,t,n){var r=e(`./common`),i=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var o=new r.Buf8(256),s=0;s<256;s++)o[s]=252<=s?6:248<=s?5:240<=s?4:224<=s?3:192<=s?2:1;function c(e,t){if(t<65537&&(e.subarray&&a||!e.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(e,t));for(var n=``,o=0;o<t;o++)n+=String.fromCharCode(e[o]);return n}o[254]=o[254]=1,n.string2buf=function(e){var t,n,i,a,o,s=e.length,c=0;for(a=0;a<s;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),c+=n<128?1:n<2048?2:n<65536?3:4;for(t=new r.Buf8(c),a=o=0;o<c;a++)(64512&(n=e.charCodeAt(a)))==55296&&a+1<s&&(64512&(i=e.charCodeAt(a+1)))==56320&&(n=65536+(n-55296<<10)+(i-56320),a++),n<128?t[o++]=n:(n<2048?t[o++]=192|n>>>6:(n<65536?t[o++]=224|n>>>12:(t[o++]=240|n>>>18,t[o++]=128|n>>>12&63),t[o++]=128|n>>>6&63),t[o++]=128|63&n);return t},n.buf2binstring=function(e){return c(e,e.length)},n.binstring2buf=function(e){for(var t=new r.Buf8(e.length),n=0,i=t.length;n<i;n++)t[n]=e.charCodeAt(n);return t},n.buf2string=function(e,t){var n,r,i,a,s=t||e.length,l=Array(2*s);for(n=r=0;n<s;)if((i=e[n++])<128)l[r++]=i;else if(4<(a=o[i]))l[r++]=65533,n+=a-1;else{for(i&=a===2?31:a===3?15:7;1<a&&n<s;)i=i<<6|63&e[n++],a--;1<a?l[r++]=65533:i<65536?l[r++]=i:(i-=65536,l[r++]=55296|i>>10&1023,l[r++]=56320|1023&i)}return c(l,r)},n.utf8border=function(e,t){var n;for((t||=e.length)>e.length&&(t=e.length),n=t-1;0<=n&&(192&e[n])==128;)n--;return n<0||n===0?t:n+o[e[n]]>t?n:t}},{"./common":41}],43:[function(e,t,n){t.exports=function(e,t,n,r){for(var i=65535&e,a=e>>>16&65535,o=0;n!==0;){for(n-=o=2e3<n?2e3:n;a=a+(i=i+t[r++]|0)|0,--o;);i%=65521,a%=65521}return i|a<<16}},{}],44:[function(e,t,n){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,n){var r=function(){for(var e,t=[],n=0;n<256;n++){e=n;for(var r=0;r<8;r++)e=1&e?3988292384^e>>>1:e>>>1;t[n]=e}return t}();t.exports=function(e,t,n,i){var a=r,o=i+n;e^=-1;for(var s=i;s<o;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}},{}],46:[function(e,t,n){var r,i=e(`../utils/common`),a=e(`./trees`),o=e(`./adler32`),s=e(`./crc32`),c=e(`./messages`),l=0,u=4,d=0,f=-2,p=-1,m=4,h=2,g=8,_=9,v=286,y=30,b=19,x=2*v+1,S=15,C=3,w=258,T=w+C+1,E=42,D=113,O=1,k=2,A=3,j=4;function M(e,t){return e.msg=c[t],t}function N(e){return(e<<1)-(4<e?9:0)}function P(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,n=t.pending;n>e.avail_out&&(n=e.avail_out),n!==0&&(i.arraySet(e.output,t.pending_buf,t.pending_out,n,e.next_out),e.next_out+=n,t.pending_out+=n,e.total_out+=n,e.avail_out-=n,t.pending-=n,t.pending===0&&(t.pending_out=0))}function I(e,t){a._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function L(e,t){e.pending_buf[e.pending++]=t}function R(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function z(e,t){var n,r,i=e.max_chain_length,a=e.strstart,o=e.prev_length,s=e.nice_match,c=e.strstart>e.w_size-T?e.strstart-(e.w_size-T):0,l=e.window,u=e.w_mask,d=e.prev,f=e.strstart+w,p=l[a+o-1],m=l[a+o];e.prev_length>=e.good_match&&(i>>=2),s>e.lookahead&&(s=e.lookahead);do if(l[(n=t)+o]===m&&l[n+o-1]===p&&l[n]===l[a]&&l[++n]===l[a+1]){a+=2,n++;do;while(l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&l[++a]===l[++n]&&a<f);if(r=w-(f-a),a=f-w,o<r){if(e.match_start=t,s<=(o=r))break;p=l[a+o-1],m=l[a+o]}}while((t=d[t&u])>c&&--i!=0);return o<=e.lookahead?o:e.lookahead}function B(e){var t,n,r,a,c,l,u,d,f,p,m=e.w_size;do{if(a=e.window_size-e.lookahead-e.strstart,e.strstart>=m+(m-T)){for(i.arraySet(e.window,e.window,m,m,0),e.match_start-=m,e.strstart-=m,e.block_start-=m,t=n=e.hash_size;r=e.head[--t],e.head[t]=m<=r?r-m:0,--n;);for(t=n=m;r=e.prev[--t],e.prev[t]=m<=r?r-m:0,--n;);a+=m}if(e.strm.avail_in===0)break;if(l=e.strm,u=e.window,d=e.strstart+e.lookahead,f=a,p=void 0,p=l.avail_in,f<p&&(p=f),n=p===0?0:(l.avail_in-=p,i.arraySet(u,l.input,l.next_in,p,d),l.state.wrap===1?l.adler=o(l.adler,u,p,d):l.state.wrap===2&&(l.adler=s(l.adler,u,p,d)),l.next_in+=p,l.total_in+=p,p),e.lookahead+=n,e.lookahead+e.insert>=C)for(c=e.strstart-e.insert,e.ins_h=e.window[c],e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[c+C-1])&e.hash_mask,e.prev[c&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=c,c++,e.insert--,!(e.lookahead+e.insert<C)););}while(e.lookahead<T&&e.strm.avail_in!==0)}function V(e,t){for(var n,r;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),n!==0&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n)),e.match_length>=C){if(r=a._tr_tally(e,e.strstart-e.match_start,e.match_length-C),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=C){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,--e.match_length!=0;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask}else r=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(r&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function H(e,t){for(var n,r,i;;){if(e.lookahead<T){if(B(e),e.lookahead<T&&t===l)return O;if(e.lookahead===0)break}if(n=0,e.lookahead>=C&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=C-1,n!==0&&e.prev_length<e.max_lazy_match&&e.strstart-n<=e.w_size-T&&(e.match_length=z(e,n),e.match_length<=5&&(e.strategy===1||e.match_length===C&&4096<e.strstart-e.match_start)&&(e.match_length=C-1)),e.prev_length>=C&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-C,r=a._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-C),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+C-1])&e.hash_mask,n=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),--e.prev_length!=0;);if(e.match_available=0,e.match_length=C-1,e.strstart++,r&&(I(e,!1),e.strm.avail_out===0))return O}else if(e.match_available){if((r=a._tr_tally(e,0,e.window[e.strstart-1]))&&I(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return O}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&=(r=a._tr_tally(e,0,e.window[e.strstart-1]),0),e.insert=e.strstart<C-1?e.strstart:C-1,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}function U(e,t,n,r,i){this.good_length=e,this.max_lazy=t,this.nice_length=n,this.max_chain=r,this.func=i}function W(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=g,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*x),this.dyn_dtree=new i.Buf16(2*(2*y+1)),this.bl_tree=new i.Buf16(2*(2*b+1)),P(this.dyn_ltree),P(this.dyn_dtree),P(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(S+1),this.heap=new i.Buf16(2*v+1),P(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*v+1),P(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=h,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?E:D,e.adler=t.wrap===2?0:1,t.last_flush=l,a._tr_init(t),d):M(e,f)}function K(e){var t=G(e);return t===d&&function(e){e.window_size=2*e.w_size,P(e.head),e.max_lazy_match=r[e.level].max_lazy,e.good_match=r[e.level].good_length,e.nice_match=r[e.level].nice_length,e.max_chain_length=r[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=C-1,e.match_available=0,e.ins_h=0}(e.state),t}function q(e,t,n,r,a,o){if(!e)return f;var s=1;if(t===p&&(t=6),r<0?(s=0,r=-r):15<r&&(s=2,r-=16),a<1||_<a||n!==g||r<8||15<r||t<0||9<t||o<0||m<o)return M(e,f);r===8&&(r=9);var c=new W;return(e.state=c).strm=e,c.wrap=s,c.gzhead=null,c.w_bits=r,c.w_size=1<<c.w_bits,c.w_mask=c.w_size-1,c.hash_bits=a+7,c.hash_size=1<<c.hash_bits,c.hash_mask=c.hash_size-1,c.hash_shift=~~((c.hash_bits+C-1)/C),c.window=new i.Buf8(2*c.w_size),c.head=new i.Buf16(c.hash_size),c.prev=new i.Buf16(c.w_size),c.lit_bufsize=1<<a+6,c.pending_buf_size=4*c.lit_bufsize,c.pending_buf=new i.Buf8(c.pending_buf_size),c.d_buf=1*c.lit_bufsize,c.l_buf=3*c.lit_bufsize,c.level=t,c.strategy=o,c.method=n,K(e)}r=[new U(0,0,0,0,function(e,t){var n=65535;for(n>e.pending_buf_size-5&&(n=e.pending_buf_size-5);;){if(e.lookahead<=1){if(B(e),e.lookahead===0&&t===l)return O;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var r=e.block_start+n;if((e.strstart===0||e.strstart>=r)&&(e.lookahead=e.strstart-r,e.strstart=r,I(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-T&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):(e.strstart>e.block_start&&(I(e,!1),e.strm.avail_out),O)}),new U(4,4,8,4,V),new U(4,5,16,8,V),new U(4,6,32,32,V),new U(4,4,16,16,H),new U(8,16,32,32,H),new U(8,16,128,128,H),new U(8,32,128,256,H),new U(32,128,258,1024,H),new U(32,258,258,4096,H)],n.deflateInit=function(e,t){return q(e,t,g,15,8,0)},n.deflateInit2=q,n.deflateReset=K,n.deflateResetKeep=G,n.deflateSetHeader=function(e,t){return e&&e.state&&e.state.wrap===2?(e.state.gzhead=t,d):f},n.deflate=function(e,t){var n,i,o,c;if(!e||!e.state||5<t||t<0)return e?M(e,f):f;if(i=e.state,!e.output||!e.input&&e.avail_in!==0||i.status===666&&t!==u)return M(e,e.avail_out===0?-5:f);if(i.strm=e,n=i.last_flush,i.last_flush=t,i.status===E){if(i.wrap===2)e.adler=0,L(i,31),L(i,139),L(i,8),i.gzhead?(L(i,+!!i.gzhead.text+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),L(i,255&i.gzhead.time),L(i,i.gzhead.time>>8&255),L(i,i.gzhead.time>>16&255),L(i,i.gzhead.time>>24&255),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(L(i,255&i.gzhead.extra.length),L(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(e.adler=s(e.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(L(i,0),L(i,0),L(i,0),L(i,0),L(i,0),L(i,i.level===9?2:2<=i.strategy||i.level<2?4:0),L(i,3),i.status=D);else{var p=g+(i.w_bits-8<<4)<<8;p|=(2<=i.strategy||i.level<2?0:i.level<6?1:i.level===6?2:3)<<6,i.strstart!==0&&(p|=32),p+=31-p%31,i.status=D,R(i,p),i.strstart!==0&&(R(i,e.adler>>>16),R(i,65535&e.adler)),e.adler=1}}if(i.status===69){if(i.gzhead.extra){for(o=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending!==i.pending_buf_size));)L(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73}if(i.status===73){if(i.gzhead.name){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.gzindex=0,i.status=91)}else i.status=91}if(i.status===91){if(i.gzhead.comment){o=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),F(e),o=i.pending,i.pending===i.pending_buf_size)){c=1;break}c=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,L(i,c)}while(c!==0);i.gzhead.hcrc&&i.pending>o&&(e.adler=s(e.adler,i.pending_buf,i.pending-o,o)),c===0&&(i.status=103)}else i.status=103}if(i.status===103&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(e),i.pending+2<=i.pending_buf_size&&(L(i,255&e.adler),L(i,e.adler>>8&255),e.adler=0,i.status=D)):i.status=D),i.pending!==0){if(F(e),e.avail_out===0)return i.last_flush=-1,d}else if(e.avail_in===0&&N(t)<=N(n)&&t!==u)return M(e,-5);if(i.status===666&&e.avail_in!==0)return M(e,-5);if(e.avail_in!==0||i.lookahead!==0||t!==l&&i.status!==666){var m=i.strategy===2?function(e,t){for(var n;;){if(e.lookahead===0&&(B(e),e.lookahead===0)){if(t===l)return O;break}if(e.match_length=0,n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):i.strategy===3?function(e,t){for(var n,r,i,o,s=e.window;;){if(e.lookahead<=w){if(B(e),e.lookahead<=w&&t===l)return O;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=C&&0<e.strstart&&(r=s[i=e.strstart-1])===s[++i]&&r===s[++i]&&r===s[++i]){o=e.strstart+w;do;while(r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&r===s[++i]&&i<o);e.match_length=w-(o-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=C?(n=a._tr_tally(e,1,e.match_length-C),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(n=a._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),n&&(I(e,!1),e.strm.avail_out===0))return O}return e.insert=0,t===u?(I(e,!0),e.strm.avail_out===0?A:j):e.last_lit&&(I(e,!1),e.strm.avail_out===0)?O:k}(i,t):r[i.level].func(i,t);if(m!==A&&m!==j||(i.status=666),m===O||m===A)return e.avail_out===0&&(i.last_flush=-1),d;if(m===k&&(t===1?a._tr_align(i):t!==5&&(a._tr_stored_block(i,0,0,!1),t===3&&(P(i.head),i.lookahead===0&&(i.strstart=0,i.block_start=0,i.insert=0))),F(e),e.avail_out===0))return i.last_flush=-1,d}return t===u?i.wrap<=0?1:(i.wrap===2?(L(i,255&e.adler),L(i,e.adler>>8&255),L(i,e.adler>>16&255),L(i,e.adler>>24&255),L(i,255&e.total_in),L(i,e.total_in>>8&255),L(i,e.total_in>>16&255),L(i,e.total_in>>24&255)):(R(i,e.adler>>>16),R(i,65535&e.adler)),F(e),0<i.wrap&&(i.wrap=-i.wrap),i.pending===0?1:d):d},n.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==E&&t!==69&&t!==73&&t!==91&&t!==103&&t!==D&&t!==666?M(e,f):(e.state=null,t===D?M(e,-3):d):f},n.deflateSetDictionary=function(e,t){var n,r,a,s,c,l,u,p,m=t.length;if(!e||!e.state||(s=(n=e.state).wrap)===2||s===1&&n.status!==E||n.lookahead)return f;for(s===1&&(e.adler=o(e.adler,t,m,0)),n.wrap=0,m>=n.w_size&&(s===0&&(P(n.head),n.strstart=0,n.block_start=0,n.insert=0),p=new i.Buf8(n.w_size),i.arraySet(p,t,m-n.w_size,n.w_size,0),t=p,m=n.w_size),c=e.avail_in,l=e.next_in,u=e.input,e.avail_in=m,e.next_in=0,e.input=t,B(n);n.lookahead>=C;){for(r=n.strstart,a=n.lookahead-(C-1);n.ins_h=(n.ins_h<<n.hash_shift^n.window[r+C-1])&n.hash_mask,n.prev[r&n.w_mask]=n.head[n.ins_h],n.head[n.ins_h]=r,r++,--a;);n.strstart=r,n.lookahead=C-1,B(n)}return n.strstart+=n.lookahead,n.block_start=n.strstart,n.insert=n.lookahead,n.lookahead=0,n.match_length=n.prev_length=C-1,n.match_available=0,e.next_in=l,e.input=u,e.avail_in=c,n.wrap=s,d},n.deflateInfo=`pako deflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,n){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name=``,this.comment=``,this.hcrc=0,this.done=!1}},{}],48:[function(e,t,n){t.exports=function(e,t){var n=e.state,r=e.next_in,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T=e.input,E;i=r+(e.avail_in-5),a=e.next_out,E=e.output,o=a-(t-e.avail_out),s=a+(e.avail_out-257),c=n.dmax,l=n.wsize,u=n.whave,d=n.wnext,f=n.window,p=n.hold,m=n.bits,h=n.lencode,g=n.distcode,_=(1<<n.lenbits)-1,v=(1<<n.distbits)-1;e:do{m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=h[p&_];t:for(;;){if(p>>>=b=y>>>24,m-=b,(b=y>>>16&255)==0)E[a++]=65535&y;else{if(!(16&b)){if(!(64&b)){y=h[(65535&y)+(p&(1<<b)-1)];continue t}if(32&b){n.mode=12;break e}e.msg=`invalid literal/length code`,n.mode=30;break e}x=65535&y,(b&=15)&&(m<b&&(p+=T[r++]<<m,m+=8),x+=p&(1<<b)-1,p>>>=b,m-=b),m<15&&(p+=T[r++]<<m,m+=8,p+=T[r++]<<m,m+=8),y=g[p&v];r:for(;;){if(p>>>=b=y>>>24,m-=b,!(16&(b=y>>>16&255))){if(!(64&b)){y=g[(65535&y)+(p&(1<<b)-1)];continue r}e.msg=`invalid distance code`,n.mode=30;break e}if(S=65535&y,m<(b&=15)&&(p+=T[r++]<<m,(m+=8)<b&&(p+=T[r++]<<m,m+=8)),c<(S+=p&(1<<b)-1)){e.msg=`invalid distance too far back`,n.mode=30;break e}if(p>>>=b,m-=b,(b=a-o)<S){if(u<(b=S-b)&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break e}if(w=f,(C=0)===d){if(C+=l-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}}else if(d<b){if(C+=l+d-b,(b-=d)<x){for(x-=b;E[a++]=f[C++],--b;);if(C=0,d<x){for(x-=b=d;E[a++]=f[C++],--b;);C=a-S,w=E}}}else if(C+=d-b,b<x){for(x-=b;E[a++]=f[C++],--b;);C=a-S,w=E}for(;2<x;)E[a++]=w[C++],E[a++]=w[C++],E[a++]=w[C++],x-=3;x&&(E[a++]=w[C++],1<x&&(E[a++]=w[C++]))}else{for(C=a-S;E[a++]=E[C++],E[a++]=E[C++],E[a++]=E[C++],2<(x-=3););x&&(E[a++]=E[C++],1<x&&(E[a++]=E[C++]))}break}}break}}while(r<i&&a<s);r-=x=m>>3,p&=(1<<(m-=x<<3))-1,e.next_in=r,e.next_out=a,e.avail_in=r<i?i-r+5:5-(r-i),e.avail_out=a<s?s-a+257:257-(a-s),n.hold=p,n.bits=m}},{}],49:[function(e,t,n){var r=e(`../utils/common`),i=e(`./adler32`),a=e(`./crc32`),o=e(`./inffast`),s=e(`./inftrees`),c=1,l=2,u=0,d=-2,f=1,p=852,m=592;function h(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function g(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function _(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg=``,t.wrap&&(e.adler=1&t.wrap),t.mode=f,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new r.Buf32(p),t.distcode=t.distdyn=new r.Buf32(m),t.sane=1,t.back=-1,u):d}function v(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,_(e)):d}function y(e,t){var n,r;return e&&e.state?(r=e.state,t<0?(n=0,t=-t):(n=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?d:(r.window!==null&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,v(e))):d}function b(e,t){var n,r;return e?(r=new g,(e.state=r).window=null,(n=y(e,t))!==u&&(e.state=null),n):d}var x,S,C=!0;function w(e){if(C){var t;for(x=new r.Buf32(512),S=new r.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(s(c,e.lens,0,288,x,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;s(l,e.lens,0,32,S,0,e.work,{bits:5}),C=!1}e.lencode=x,e.lenbits=9,e.distcode=S,e.distbits=5}function T(e,t,n,i){var a,o=e.state;return o.window===null&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new r.Buf8(o.wsize)),i>=o.wsize?(r.arraySet(o.window,t,n-o.wsize,o.wsize,0),o.wnext=0,o.whave=o.wsize):(i<(a=o.wsize-o.wnext)&&(a=i),r.arraySet(o.window,t,n-i,a,o.wnext),(i-=a)?(r.arraySet(o.window,t,n-i,i,0),o.wnext=i,o.whave=o.wsize):(o.wnext+=a,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=a))),0}n.inflateReset=v,n.inflateReset2=y,n.inflateResetKeep=_,n.inflateInit=function(e){return b(e,15)},n.inflateInit2=b,n.inflate=function(e,t){var n,p,m,g,_,v,y,b,x,S,C,E,D,O,k,A,j,M,N,P,F,I,L,R,z=0,B=new r.Buf8(4),V=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&e.avail_in!==0)return d;(n=e.state).mode===12&&(n.mode=13),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,S=v,C=y,I=u;e:for(;;)switch(n.mode){case f:if(n.wrap===0){n.mode=13;break}for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(2&n.wrap&&b===35615){B[n.check=0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0),x=b=0,n.mode=2;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&b)<<8)+(b>>8))%31){e.msg=`incorrect header check`,n.mode=30;break}if((15&b)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(x-=4,F=8+(15&(b>>>=4)),n.wbits===0)n.wbits=F;else if(F>n.wbits){e.msg=`invalid window size`,n.mode=30;break}n.dmax=1<<F,e.adler=n.check=1,n.mode=512&b?10:12,x=b=0;break;case 2:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.flags=b,(255&n.flags)!=8){e.msg=`unknown compression method`,n.mode=30;break}if(57344&n.flags){e.msg=`unknown header flags set`,n.mode=30;break}n.head&&(n.head.text=b>>8&1),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=3;case 3:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.time=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,B[2]=b>>>16&255,B[3]=b>>>24&255,n.check=a(n.check,B,4,0)),x=b=0,n.mode=4;case 4:for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.head&&(n.head.xflags=255&b,n.head.os=b>>8),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0,n.mode=5;case 5:if(1024&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length=b,n.head&&(n.head.extra_len=b),512&n.flags&&(B[0]=255&b,B[1]=b>>>8&255,n.check=a(n.check,B,2,0)),x=b=0}else n.head&&(n.head.extra=null);n.mode=6;case 6:if(1024&n.flags&&(v<(E=n.length)&&(E=v),E&&(n.head&&(F=n.head.extra_len-n.length,n.head.extra||(n.head.extra=Array(n.head.extra_len)),r.arraySet(n.head.extra,p,g,E,F)),512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,n.length-=E),n.length))break e;n.length=0,n.mode=7;case 7:if(2048&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.name+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.name=null);n.length=0,n.mode=8;case 8:if(4096&n.flags){if(v===0)break e;for(E=0;F=p[g+E++],n.head&&F&&n.length<65536&&(n.head.comment+=String.fromCharCode(F)),F&&E<v;);if(512&n.flags&&(n.check=a(n.check,p,E,g)),v-=E,g+=E,F)break e}else n.head&&(n.head.comment=null);n.mode=9;case 9:if(512&n.flags){for(;x<16;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(65535&n.check)){e.msg=`header crc mismatch`,n.mode=30;break}x=b=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=12;break;case 10:for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}e.adler=n.check=h(b),x=b=0,n.mode=11;case 11:if(n.havedict===0)return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,2;e.adler=n.check=1,n.mode=12;case 12:if(t===5||t===6)break e;case 13:if(n.last){b>>>=7&x,x-=7&x,n.mode=27;break}for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}switch(n.last=1&b,--x,3&(b>>>=1)){case 0:n.mode=14;break;case 1:if(w(n),n.mode=20,t!==6)break;b>>>=2,x-=2;break e;case 2:n.mode=17;break;case 3:e.msg=`invalid block type`,n.mode=30}b>>>=2,x-=2;break;case 14:for(b>>>=7&x,x-=7&x;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if((65535&b)!=(b>>>16^65535)){e.msg=`invalid stored block lengths`,n.mode=30;break}if(n.length=65535&b,x=b=0,n.mode=15,t===6)break e;case 15:n.mode=16;case 16:if(E=n.length){if(v<E&&(E=v),y<E&&(E=y),E===0)break e;r.arraySet(m,p,g,E,_),v-=E,g+=E,y-=E,_+=E,n.length-=E;break}n.mode=12;break;case 17:for(;x<14;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(n.nlen=257+(31&b),b>>>=5,x-=5,n.ndist=1+(31&b),b>>>=5,x-=5,n.ncode=4+(15&b),b>>>=4,x-=4,286<n.nlen||30<n.ndist){e.msg=`too many length or distance symbols`,n.mode=30;break}n.have=0,n.mode=18;case 18:for(;n.have<n.ncode;){for(;x<3;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.lens[V[n.have++]]=7&b,b>>>=3,x-=3}for(;n.have<19;)n.lens[V[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,L={bits:n.lenbits},I=s(0,n.lens,0,19,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid code lengths set`,n.mode=30;break}n.have=0,n.mode=19;case 19:for(;n.have<n.nlen+n.ndist;){for(;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(j<16)b>>>=k,x-=k,n.lens[n.have++]=j;else{if(j===16){for(R=k+2;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b>>>=k,x-=k,n.have===0){e.msg=`invalid bit length repeat`,n.mode=30;break}F=n.lens[n.have-1],E=3+(3&b),b>>>=2,x-=2}else if(j===17){for(R=k+3;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=3+(7&(b>>>=k)),b>>>=3,x-=3}else{for(R=k+7;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}x-=k,F=0,E=11+(127&(b>>>=k)),b>>>=7,x-=7}if(n.have+E>n.nlen+n.ndist){e.msg=`invalid bit length repeat`,n.mode=30;break}for(;E--;)n.lens[n.have++]=F}}if(n.mode===30)break;if(n.lens[256]===0){e.msg=`invalid code -- missing end-of-block`,n.mode=30;break}if(n.lenbits=9,L={bits:n.lenbits},I=s(c,n.lens,0,n.nlen,n.lencode,0,n.work,L),n.lenbits=L.bits,I){e.msg=`invalid literal/lengths set`,n.mode=30;break}if(n.distbits=6,n.distcode=n.distdyn,L={bits:n.distbits},I=s(l,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,L),n.distbits=L.bits,I){e.msg=`invalid distances set`,n.mode=30;break}if(n.mode=20,t===6)break e;case 20:n.mode=21;case 21:if(6<=v&&258<=y){e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,o(e,C),_=e.next_out,m=e.output,y=e.avail_out,g=e.next_in,p=e.input,v=e.avail_in,b=n.hold,x=n.bits,n.mode===12&&(n.back=-1);break}for(n.back=0;A=(z=n.lencode[b&(1<<n.lenbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(A&&!(240&A)){for(M=k,N=A,P=j;A=(z=n.lencode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,n.length=j,A===0){n.mode=26;break}if(32&A){n.back=-1,n.mode=12;break}if(64&A){e.msg=`invalid literal/length code`,n.mode=30;break}n.extra=15&A,n.mode=22;case 22:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.length+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=23;case 23:for(;A=(z=n.distcode[b&(1<<n.distbits)-1])>>>16&255,j=65535&z,!((k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(!(240&A)){for(M=k,N=A,P=j;A=(z=n.distcode[P+((b&(1<<M+N)-1)>>M)])>>>16&255,j=65535&z,!(M+(k=z>>>24)<=x);){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}b>>>=M,x-=M,n.back+=M}if(b>>>=k,x-=k,n.back+=k,64&A){e.msg=`invalid distance code`,n.mode=30;break}n.offset=j,n.extra=15&A,n.mode=24;case 24:if(n.extra){for(R=n.extra;x<R;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}n.offset+=b&(1<<n.extra)-1,b>>>=n.extra,x-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg=`invalid distance too far back`,n.mode=30;break}n.mode=25;case 25:if(y===0)break e;if(E=C-y,n.offset>E){if((E=n.offset-E)>n.whave&&n.sane){e.msg=`invalid distance too far back`,n.mode=30;break}D=E>n.wnext?(E-=n.wnext,n.wsize-E):n.wnext-E,E>n.length&&(E=n.length),O=n.window}else O=m,D=_-n.offset,E=n.length;for(y<E&&(E=y),y-=E,n.length-=E;m[_++]=O[D++],--E;);n.length===0&&(n.mode=21);break;case 26:if(y===0)break e;m[_++]=n.length,y--,n.mode=21;break;case 27:if(n.wrap){for(;x<32;){if(v===0)break e;v--,b|=p[g++]<<x,x+=8}if(C-=y,e.total_out+=C,n.total+=C,C&&(e.adler=n.check=n.flags?a(n.check,m,C,_-C):i(n.check,m,C,_-C)),C=y,(n.flags?b:h(b))!==n.check){e.msg=`incorrect data check`,n.mode=30;break}x=b=0}n.mode=28;case 28:if(n.wrap&&n.flags){for(;x<32;){if(v===0)break e;v--,b+=p[g++]<<x,x+=8}if(b!==(0|n.total)){e.msg=`incorrect length check`,n.mode=30;break}x=b=0}n.mode=29;case 29:I=1;break e;case 30:I=-3;break e;case 31:return-4;default:return d}return e.next_out=_,e.avail_out=y,e.next_in=g,e.avail_in=v,n.hold=b,n.bits=x,(n.wsize||C!==e.avail_out&&n.mode<30&&(n.mode<27||t!==4))&&T(e,e.output,e.next_out,C-e.avail_out)?(n.mode=31,-4):(S-=e.avail_in,C-=e.avail_out,e.total_in+=S,e.total_out+=C,n.total+=C,n.wrap&&C&&(e.adler=n.check=n.flags?a(n.check,m,C,e.next_out-C):i(n.check,m,C,e.next_out-C)),e.data_type=n.bits+(n.last?64:0)+(n.mode===12?128:0)+(n.mode===20||n.mode===15?256:0),(S==0&&C===0||t===4)&&I===u&&(I=-5),I)},n.inflateEnd=function(e){if(!e||!e.state)return d;var t=e.state;return t.window&&=null,e.state=null,u},n.inflateGetHeader=function(e,t){var n;return e&&e.state&&2&(n=e.state).wrap?((n.head=t).done=!1,u):d},n.inflateSetDictionary=function(e,t){var n,r=t.length;return e&&e.state?(n=e.state).wrap!==0&&n.mode!==11?d:n.mode===11&&i(1,t,r,0)!==n.check?-3:T(e,t,r,r)?(n.mode=31,-4):(n.havedict=1,u):d},n.inflateInfo=`pako inflate (from Nodeca project)`},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,n){var r=e(`../utils/common`),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],o=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],s=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,n,c,l,u,d,f){var p,m,h,g,_,v,y,b,x,S=f.bits,C=0,w=0,T=0,E=0,D=0,O=0,k=0,A=0,j=0,M=0,N=null,P=0,F=new r.Buf16(16),I=new r.Buf16(16),L=null,R=0;for(C=0;C<=15;C++)F[C]=0;for(w=0;w<c;w++)F[t[n+w]]++;for(D=S,E=15;1<=E&&F[E]===0;E--);if(E<D&&(D=E),E===0)return l[u++]=20971520,l[u++]=20971520,f.bits=1,0;for(T=1;T<E&&F[T]===0;T++);for(D<T&&(D=T),C=A=1;C<=15;C++)if(A<<=1,(A-=F[C])<0)return-1;if(0<A&&(e===0||E!==1))return-1;for(I[1]=0,C=1;C<15;C++)I[C+1]=I[C]+F[C];for(w=0;w<c;w++)t[n+w]!==0&&(d[I[t[n+w]]++]=w);if(v=e===0?(N=L=d,19):e===1?(N=i,P-=257,L=a,R-=257,256):(N=o,L=s,-1),C=T,_=u,k=w=M=0,h=-1,g=(j=1<<(O=D))-1,e===1&&852<j||e===2&&592<j)return 1;for(;;){for(y=C-k,x=d[w]<v?(b=0,d[w]):d[w]>v?(b=L[R+d[w]],N[P+d[w]]):(b=96,0),p=1<<C-k,T=m=1<<O;l[_+(M>>k)+(m-=p)]=y<<24|b<<16|x,m!==0;);for(p=1<<C-1;M&p;)p>>=1;if(p===0?M=0:(M&=p-1,M+=p),w++,--F[C]==0){if(C===E)break;C=t[n+d[w]]}if(D<C&&(M&g)!==h){for(k===0&&(k=D),_+=T,A=1<<(O=C-k);O+k<E&&!((A-=F[O+k])<=0);)O++,A<<=1;if(j+=1<<O,e===1&&852<j||e===2&&592<j)return 1;l[h=M&g]=D<<24|O<<16|_-u}}return M!==0&&(l[_+M]=C-k<<24|4194304),f.bits=D,0}},{"../utils/common":41}],51:[function(e,t,n){t.exports={2:`need dictionary`,1:`stream end`,0:``,"-1":`file error`,"-2":`stream error`,"-3":`data error`,"-4":`insufficient memory`,"-5":`buffer error`,"-6":`incompatible version`}},{}],52:[function(e,t,n){var r=e(`../utils/common`),i=0,a=1;function o(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,c=29,l=256,u=l+1+c,d=30,f=19,p=2*u+1,m=15,h=16,g=7,_=256,v=16,y=17,b=18,x=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],S=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],w=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(2*(u+2));o(T);var E=Array(2*d);o(E);var D=Array(512);o(D);var O=Array(256);o(O);var k=Array(c);o(k);var A,j,M,N=Array(d);function P(e,t,n,r,i){this.static_tree=e,this.extra_bits=t,this.extra_base=n,this.elems=r,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function I(e){return e<256?D[e]:D[256+(e>>>7)]}function L(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function R(e,t,n){e.bi_valid>h-n?(e.bi_buf|=t<<e.bi_valid&65535,L(e,e.bi_buf),e.bi_buf=t>>h-e.bi_valid,e.bi_valid+=n-h):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=n)}function z(e,t,n){R(e,n[2*t],n[2*t+1])}function B(e,t){for(var n=0;n|=1&e,e>>>=1,n<<=1,0<--t;);return n>>>1}function V(e,t,n){var r,i,a=Array(m+1),o=0;for(r=1;r<=m;r++)a[r]=o=o+n[r-1]<<1;for(i=0;i<=t;i++){var s=e[2*i+1];s!==0&&(e[2*i]=B(a[s]++,s))}}function H(e){for(var t=0;t<u;t++)e.dyn_ltree[2*t]=0;for(t=0;t<d;t++)e.dyn_dtree[2*t]=0;for(t=0;t<f;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*_]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function U(e){8<e.bi_valid?L(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function W(e,t,n,r){var i=2*t,a=2*n;return e[i]<e[a]||e[i]===e[a]&&r[t]<=r[n]}function G(e,t,n){for(var r=e.heap[n],i=n<<1;i<=e.heap_len&&(i<e.heap_len&&W(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!W(t,r,e.heap[i],e.depth));)e.heap[n]=e.heap[i],n=i,i<<=1;e.heap[n]=r}function K(e,t,n){var r,i,a,o,s=0;if(e.last_lit!==0)for(;r=e.pending_buf[e.d_buf+2*s]<<8|e.pending_buf[e.d_buf+2*s+1],i=e.pending_buf[e.l_buf+s],s++,r===0?z(e,i,t):(z(e,(a=O[i])+l+1,t),(o=x[a])!==0&&R(e,i-=k[a],o),z(e,a=I(--r),n),(o=S[a])!==0&&R(e,r-=N[a],o)),s<e.last_lit;);z(e,_,t)}function q(e,t){var n,r,i,a=t.dyn_tree,o=t.stat_desc.static_tree,s=t.stat_desc.has_stree,c=t.stat_desc.elems,l=-1;for(e.heap_len=0,e.heap_max=p,n=0;n<c;n++)a[2*n]===0?a[2*n+1]=0:(e.heap[++e.heap_len]=l=n,e.depth[n]=0);for(;e.heap_len<2;)a[2*(i=e.heap[++e.heap_len]=l<2?++l:0)]=1,e.depth[i]=0,e.opt_len--,s&&(e.static_len-=o[2*i+1]);for(t.max_code=l,n=e.heap_len>>1;1<=n;n--)G(e,a,n);for(i=c;n=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,a,1),r=e.heap[1],e.heap[--e.heap_max]=n,e.heap[--e.heap_max]=r,a[2*i]=a[2*n]+a[2*r],e.depth[i]=(e.depth[n]>=e.depth[r]?e.depth[n]:e.depth[r])+1,a[2*n+1]=a[2*r+1]=i,e.heap[1]=i++,G(e,a,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var n,r,i,a,o,s,c=t.dyn_tree,l=t.max_code,u=t.stat_desc.static_tree,d=t.stat_desc.has_stree,f=t.stat_desc.extra_bits,h=t.stat_desc.extra_base,g=t.stat_desc.max_length,_=0;for(a=0;a<=m;a++)e.bl_count[a]=0;for(c[2*e.heap[e.heap_max]+1]=0,n=e.heap_max+1;n<p;n++)g<(a=c[2*c[2*(r=e.heap[n])+1]+1]+1)&&(a=g,_++),c[2*r+1]=a,l<r||(e.bl_count[a]++,o=0,h<=r&&(o=f[r-h]),s=c[2*r],e.opt_len+=s*(a+o),d&&(e.static_len+=s*(u[2*r+1]+o)));if(_!==0){do{for(a=g-1;e.bl_count[a]===0;)a--;e.bl_count[a]--,e.bl_count[a+1]+=2,e.bl_count[g]--,_-=2}while(0<_);for(a=g;a!==0;a--)for(r=e.bl_count[a];r!==0;)l<(i=e.heap[--n])||(c[2*i+1]!==a&&(e.opt_len+=(a-c[2*i+1])*c[2*i],c[2*i+1]=a),r--)}}(e,t),V(a,l,e.bl_count)}function J(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),t[2*(n+1)+1]=65535,r=0;r<=n;r++)i=o,o=t[2*(r+1)+1],++s<c&&i===o||(s<l?e.bl_tree[2*i]+=s:i===0?s<=10?e.bl_tree[2*y]++:e.bl_tree[2*b]++:(i!==a&&e.bl_tree[2*i]++,e.bl_tree[2*v]++),a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4))}function Y(e,t,n){var r,i,a=-1,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),r=0;r<=n;r++)if(i=o,o=t[2*(r+1)+1],!(++s<c&&i===o)){if(s<l)for(;z(e,i,e.bl_tree),--s!=0;);else i===0?s<=10?(z(e,y,e.bl_tree),R(e,s-3,3)):(z(e,b,e.bl_tree),R(e,s-11,7)):(i!==a&&(z(e,i,e.bl_tree),s--),z(e,v,e.bl_tree),R(e,s-3,2));a=i,l=(s=0)===o?(c=138,3):i===o?(c=6,3):(c=7,4)}}o(N);var X=!1;function Z(e,t,n,i){R(e,(s<<1)+ +!!i,3),function(e,t,n,i){U(e),L(e,n),L(e,~n),r.arraySet(e.pending_buf,e.window,t,n,e.pending),e.pending+=n}(e,t,n,!0)}n._tr_init=function(e){X||=(function(){var e,t,n,r,i,a=Array(m+1);for(r=n=0;r<c-1;r++)for(k[r]=n,e=0;e<1<<x[r];e++)O[n++]=r;for(O[n-1]=r,r=i=0;r<16;r++)for(N[r]=i,e=0;e<1<<S[r];e++)D[i++]=r;for(i>>=7;r<d;r++)for(N[r]=i<<7,e=0;e<1<<S[r]-7;e++)D[256+i++]=r;for(t=0;t<=m;t++)a[t]=0;for(e=0;e<=143;)T[2*e+1]=8,e++,a[8]++;for(;e<=255;)T[2*e+1]=9,e++,a[9]++;for(;e<=279;)T[2*e+1]=7,e++,a[7]++;for(;e<=287;)T[2*e+1]=8,e++,a[8]++;for(V(T,u+1,a),e=0;e<d;e++)E[2*e+1]=5,E[2*e]=B(e,5);A=new P(T,x,l+1,u,m),j=new P(E,S,0,d,m),M=new P([],C,0,f,g)}(),!0),e.l_desc=new F(e.dyn_ltree,A),e.d_desc=new F(e.dyn_dtree,j),e.bl_desc=new F(e.bl_tree,M),e.bi_buf=0,e.bi_valid=0,H(e)},n._tr_stored_block=Z,n._tr_flush_block=function(e,t,n,r){var o,s,c=0;0<e.level?(e.strm.data_type===2&&(e.strm.data_type=function(e){var t,n=4093624447;for(t=0;t<=31;t++,n>>>=1)if(1&n&&e.dyn_ltree[2*t]!==0)return i;if(e.dyn_ltree[18]!==0||e.dyn_ltree[20]!==0||e.dyn_ltree[26]!==0)return a;for(t=32;t<l;t++)if(e.dyn_ltree[2*t]!==0)return a;return i}(e)),q(e,e.l_desc),q(e,e.d_desc),c=function(e){var t;for(J(e,e.dyn_ltree,e.l_desc.max_code),J(e,e.dyn_dtree,e.d_desc.max_code),q(e,e.bl_desc),t=f-1;3<=t&&e.bl_tree[2*w[t]+1]===0;t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),o=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=o&&(o=s)):o=s=n+5,n+4<=o&&t!==-1?Z(e,t,n,r):e.strategy===4||s===o?(R(e,2+ +!!r,3),K(e,T,E)):(R(e,4+ +!!r,3),function(e,t,n,r){var i;for(R(e,t-257,5),R(e,n-1,5),R(e,r-4,4),i=0;i<r;i++)R(e,e.bl_tree[2*w[i]+1],3);Y(e,e.dyn_ltree,t-1),Y(e,e.dyn_dtree,n-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,c+1),K(e,e.dyn_ltree,e.dyn_dtree)),H(e),r&&U(e)},n._tr_tally=function(e,t,n){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&n,e.last_lit++,t===0?e.dyn_ltree[2*n]++:(e.matches++,t--,e.dyn_ltree[2*(O[n]+l+1)]++,e.dyn_dtree[2*I(t)]++),e.last_lit===e.lit_bufsize-1},n._tr_align=function(e){R(e,2,3),z(e,_,T),function(e){e.bi_valid===16?(L(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,n){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg=``,this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,n){(function(e){(function(e,t){if(!e.setImmediate){var n,r,i,a,o=1,s={},c=!1,l=e.document,u=Object.getPrototypeOf&&Object.getPrototypeOf(e);u=u&&u.setTimeout?u:e,n={}.toString.call(e.process)===`[object process]`?function(e){process.nextTick(function(){f(e)})}:function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage(``,`*`),e.onmessage=n,t}}()?(a=`setImmediate$`+Math.random()+`$`,e.addEventListener?e.addEventListener(`message`,p,!1):e.attachEvent(`onmessage`,p),function(t){e.postMessage(a+t,`*`)}):e.MessageChannel?((i=new MessageChannel).port1.onmessage=function(e){f(e.data)},function(e){i.port2.postMessage(e)}):l&&`onreadystatechange`in l.createElement(`script`)?(r=l.documentElement,function(e){var t=l.createElement(`script`);t.onreadystatechange=function(){f(e),t.onreadystatechange=null,r.removeChild(t),t=null},r.appendChild(t)}):function(e){setTimeout(f,0,e)},u.setImmediate=function(e){typeof e!=`function`&&(e=Function(``+e));for(var t=Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];return s[o]={callback:e,args:t},n(o),o++},u.clearImmediate=d}function d(e){delete s[e]}function f(e){if(c)setTimeout(f,0,e);else{var n=s[e];if(n){c=!0;try{(function(e){var n=e.callback,r=e.args;switch(r.length){case 0:n();break;case 1:n(r[0]);break;case 2:n(r[0],r[1]);break;case 3:n(r[0],r[1],r[2]);break;default:n.apply(t,r)}})(n)}finally{d(e),c=!1}}}}function p(t){t.source===e&&typeof t.data==`string`&&t.data.indexOf(a)===0&&f(+t.data.slice(a.length))}})(typeof self>`u`?e===void 0?this:e:self)}).call(this,typeof global<`u`?global:typeof self<`u`?self:typeof window<`u`?window:{})},{}]},{},[10])(10)})}))(),1),i={"README.txt":`============================================================
PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION
IB DP Computer Science SL Internal Assessment Product
100% OFFLINE STANDALONE APPLICATION (NO INTERNET REQUIRED)
============================================================

This package contains TWO offline desktop interfaces for your device,
running 100% locally with zero internet connection:

1. MODERN HIGH-END DESKTOP APP (RECOMMENDED)
   - The exact sleek, responsive UI with interactive doughnut & bar
     charts, smooth animations, quick category sliders, and the Admin
     User Management console.
   - Runs in a dedicated native window (Chrome / Edge app-mode) served
     by Python's zero-dependency local offline server.
   - Data persists completely on your local device.

2. PYTHON TKINTER DESKTOP APP (DARK SLATE EDITION)
   - Built with standard Python Tkinter and SQLite3.
   - Redesigned with a modern Dark Slate palette (#0B0F19 / #131B2E),
     styled Treeviews, and dark embedded Matplotlib charts.
   - Ideal for IB DP Computer Science Criterion C code submission.

HOW TO RUN:
-----------
* ON WINDOWS:
  Double-click "run_windows.bat"
  - Select [1] to launch the Modern High-End App (Default)
  - Select [2] to launch the Python Tkinter Dark Edition
  - Select [3] to run the 20-point automated test suite

* ON MAC / LINUX:
  Double-click "run_mac_linux.sh" (or run: bash run_mac_linux.sh in Terminal)
  - Choose [1] for Modern High-End App, or [2] for Python Tkinter

REQUIREMENTS:
-------------
Standard Python 3 (Tkinter, SQLite, and http.server are built into Python).
To enable embedded charts in the Tkinter edition, install matplotlib once:
  pip install matplotlib

AUTOMATED TEST SUITE (Criterion E):
-----------------------------------
Run: python3 test_suite.py
Verifies all 20 test cases (normal, boundary, edge, erroneous inputs).

DATA PERSISTENCE:
-----------------
All data is stored locally on your device with zero cloud tracking.
============================================================
`,"run_windows.bat":`@echo off
title Personal Finance Manager - Student Hostel Edition (Offline)
cls
echo ===================================================================
echo   PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION
echo   100%% OFFLINE ON-DEVICE LAUNCHER (ZERO INTERNET REQUIRED)
echo ===================================================================
echo.
echo   Choose your preferred desktop interface:
echo.
echo   [1] Modern High-End Desktop App (Recommended - Sleek & Full Features)
echo   [2] Python Tkinter Desktop App (Dark Slate Edition)
echo   [3] Run Automated 20-Point Test Suite (IB Criterion E Verification)
echo   [4] Exit
echo.
set /p opt="Enter choice (1-4) [Default is 1]: "
if "%opt%"=="" set opt=1

if "%opt%"=="1" (
    echo.
    echo Starting Modern Offline Interface...
    python launch_offline_ui.py
    if errorlevel 1 (
        echo Trying python3...
        python3 launch_offline_ui.py
    )
    goto end
)

if "%opt%"=="2" (
    echo.
    echo Starting Python Tkinter Interface...
    python main.py
    if errorlevel 1 (
        echo Trying python3...
        python3 main.py
    )
    goto end
)

if "%opt%"=="3" (
    echo.
    echo Running Automated Test Suite...
    python test_suite.py
    if errorlevel 1 (
        python3 test_suite.py
    )
    pause
    goto end
)

:end
`,"run_mac_linux.sh":`#!/usr/bin/env bash
# Personal Finance Manager (Hostel Edition) - Offline Launcher
cd "$(dirname "$0")"

echo "==================================================================="
echo "  PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION"
echo "  100% OFFLINE ON-DEVICE LAUNCHER (ZERO INTERNET REQUIRED)"
echo "==================================================================="
echo ""
echo "  Choose your preferred desktop interface:"
echo ""
echo "  [1] Modern High-End Desktop App (Recommended - Sleek & Full Features)"
echo "  [2] Python Tkinter Desktop App (Dark Slate Edition)"
echo "  [3] Run Automated 20-Point Test Suite (IB Criterion E Verification)"
echo ""
read -p "Enter choice (1-3) [Default: 1]: " opt
opt=\${opt:-1}

if [ "$opt" = "1" ]; then
    echo "Starting Modern Offline Interface..."
    python3 launch_offline_ui.py || python launch_offline_ui.py
elif [ "$opt" = "2" ]; then
    echo "Starting Python Tkinter Interface..."
    python3 main.py || python main.py
elif [ "$opt" = "3" ]; then
    echo "Running Automated Test Suite..."
    python3 test_suite.py || python test_suite.py
fi
`,"launch_offline_ui.py":`"""
Offline Desktop Launcher for Personal Finance Manager
Serves the modern interface locally on localhost and opens in dedicated native app window.
100% Offline, Zero external dependencies, Zero internet required.
"""

import http.server
import socketserver
import webbrowser
import threading
import subprocess
import shutil
import sys
import os

PORT = 8080

def get_base_dir():
    # If running from inside python_project or app root
    current = os.path.dirname(os.path.abspath(__file__))
    if os.path.exists(os.path.join(current, "dist")):
        return os.path.join(current, "dist")
    parent = os.path.dirname(current)
    if os.path.exists(os.path.join(parent, "dist")):
        return os.path.join(parent, "dist")
    if os.path.exists(os.path.join(current, "offline_ui")):
        return os.path.join(current, "offline_ui")
    return current

class OfflineHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=get_base_dir(), **kwargs)

    def log_message(self, format, *args):
        # Quiet logger
        pass

def launch_app_window(url):
    """Attempts to launch Chrome or Edge in standalone native app mode (--app)."""
    # 1. Check Chrome
    chrome_paths = [
        # Windows
        os.path.expandvars(r"%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe"),
        # Mac
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        # Linux
        "google-chrome",
        "chrome",
        "chromium-browser",
        "chromium"
    ]

    for p in chrome_paths:
        cmd = shutil.which(p) or (p if os.path.exists(p) else None)
        if cmd:
            try:
                subprocess.Popen([cmd, f"--app={url}", "--window-size=1200,800"])
                return
            except Exception:
                pass

    # 2. Check Edge
    edge_paths = [
        os.path.expandvars(r"%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"),
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        "microsoft-edge"
    ]

    for p in edge_paths:
        cmd = shutil.which(p) or (p if os.path.exists(p) else None)
        if cmd:
            try:
                subprocess.Popen([cmd, f"--app={url}", "--window-size=1200,800"])
                return
            except Exception:
                pass

    # 3. Fallback to standard default browser
    webbrowser.open(url)

def main():
    base_dir = get_base_dir()
    print("=" * 65)
    print("PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION")
    print("Launching modern offline interface...")
    print(f"Directory: {base_dir}")
    print("=" * 65)

    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    server_started = False
    port = PORT
    httpd = None

    for attempt in range(5):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", port), OfflineHandler)
            server_started = True
            break
        except OSError:
            port += 1

    if not server_started or httpd is None:
        print("[Error] Could not bind local port. Opening file directly...")
        index_file = os.path.join(base_dir, "index.html")
        webbrowser.open(f"file://{index_file}")
        return

    url = f"http://127.0.0.1:{port}"
    print(f"[System] Local offline server running at: {url}")
    print("[System] Opening dedicated modern app window (no internet required)...")

    # Launch app window in thread after 0.5s
    timer = threading.Timer(0.5, lambda: launch_app_window(url))
    timer.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n[System] Offline app stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()
`,"main.py":`"""
Main Entry Point
Personal Finance Manager (Hostel Medical Student Edition)
IB DP Computer Science SL Internal Assessment Product
Tech Stack: Python + SQLite + Tkinter + Matplotlib
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.db_manager import DatabaseManager
from services.transaction_service import TransactionService
from services.budget_service import BudgetService
from services.forecast_service import ForecastService

def seed_sample_data_if_empty(db_manager, trans_service, budget_service, forecast_service):
    """
    Seeds initial realistic data matching the client's scenario (40,000 PKR monthly stipend,
    hostel food, transport, books, and savings goal) so the user can immediately evaluate
    the working system.
    """
    with db_manager.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) AS count FROM transactions")
        count = cursor.fetchone()["count"]

    if count == 0:
        print("[System] Seeding realistic scenario for hostel medical student (40,000 PKR)...")
        # 1. Active Savings Goal (Littmann Stethoscope 25,000 PKR)
        forecast_service.set_savings_goal(
            name="Littmann Classic III Stethoscope",
            target_amount=25000.0,
            target_date="2026-12-31"
        )

        # 2. Get Category IDs
        cats = {c["name"]: c["category_id"] for c in db_manager.get_all_categories()}

        # 3. Monthly Budget Setup for current month (Oct 2026)
        current_month = "2026-10"
        budget_service.set_budget(cats["Food & Mess"], current_month, 13600.0)
        budget_service.set_budget(cats["Transport / Fuel"], current_month, 5100.0)
        budget_service.set_budget(cats["Education & Books"], current_month, 5100.0)
        budget_service.set_budget(cats["Personal Care & Laundry"], current_month, 5100.0)
        budget_service.set_budget(cats["Miscellaneous"], current_month, 5100.0)

        # 4. Income Record (Stipend 40,000 PKR)
        trans_service.validate_and_record_transaction(
            amount=40000.0,
            trans_date="2026-10-01",
            description="Monthly stipend deposit from hospital / family",
            category_id=cats["Monthly Stipend"]
        )

        # 5. Recorded Expenses (Matching the worked numeric trace from Phase 2)
        trans_service.validate_and_record_transaction(6000.0, "2026-10-02", "Hostel Mess Advance monthly coupon", cats["Food & Mess"])
        trans_service.validate_and_record_transaction(3200.0, "2026-10-10", "Weekly grocery & hostel snacks", cats["Food & Mess"])
        trans_service.validate_and_record_transaction(2000.0, "2026-10-18", "Cafeteria meals with study group", cats["Food & Mess"])

        trans_service.validate_and_record_transaction(2200.0, "2026-10-05", "Motorcycle petrol tank full", cats["Transport / Fuel"])
        trans_service.validate_and_record_transaction(2200.0, "2026-10-16", "Motorcycle petrol refuel", cats["Transport / Fuel"])

        trans_service.validate_and_record_transaction(1800.0, "2026-10-07", "Robbins Basic Pathology review guide", cats["Education & Books"])
        trans_service.validate_and_record_transaction(700.0, "2026-10-14", "Anatomy lab dissection gloves & notebook", cats["Education & Books"])

        trans_service.validate_and_record_transaction(1200.0, "2026-10-04", "Hostel laundry bundle monthly service", cats["Personal Care & Laundry"])
        trans_service.validate_and_record_transaction(600.0, "2026-10-12", "Toiletries & soap", cats["Personal Care & Laundry"])

        trans_service.validate_and_record_transaction(1100.0, "2026-10-15", "Room shared electricity unit contribution", cats["Miscellaneous"])
        print("[System] Seeding complete.")

def run_cli_demo(db_mgr, trans_svc, budget_svc, forecast_svc):
    """Fallback interactive CLI console if running in a headless environment without X11/Tkinter."""
    print("=" * 65)
    print("PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION (CLI DEMO)")
    print("Client: Medical Student | Monthly Stipend: 40,000 PKR")
    print("=" * 65)
    month = "2026-10"
    statuses = budget_svc.get_monthly_budget_status(month)
    total_spent = sum(s["spent"] for s in statuses)
    total_budget = sum(s["allocated"] for s in statuses)
    forecast = forecast_svc.forecast_month_end(month, 40000.0, "2026-10-20")
    goal = forecast_svc.get_savings_goal_progress()

    print(f"\\n[DASHBOARD: {month}]")
    print(f"Total Budgeted:   PKR {total_budget:,.2f}")
    print(f"Total Spent:      PKR {total_spent:,.2f}")
    print(f"Remaining Budget: PKR {total_budget - total_spent:,.2f}")
    print(f"Daily Burn Rate:  PKR {forecast['daily_burn_rate']:,.2f} / day")
    print(f"Projected Savings:PKR {forecast['projected_savings']:,.2f} by month-end")

    alerts = budget_svc.check_threshold_alerts(month)
    if alerts:
        print("\\n[ACTIVE ALERTS (Criterion 6)]")
        for a in alerts:
            print(f"  * {a['level']}: [{a['category']}] {a['message']}")

    print("\\n[CATEGORY BUDGET STATUS (Criterion 4)]")
    for s in statuses:
        print(f"  {s['category_name']:<25} Budget: {s['allocated']:>8,.0f} | Spent: {s['spent']:>8,.0f} | Left: {s['remaining']:>8,.0f} | Used: {s['percentage_used']:>5.1f}%")

    if goal:
        print("\\n[SAVINGS GOAL TRACKER (Criterion 12)]")
        print(f"  Goal: {goal['goal_name']}")
        print(f"  Target: PKR {goal['target_amount']:,.2f} | Deadline: {goal['target_date']}")
        print(f"  Net Saved: PKR {goal['net_saved']:,.2f} ({goal['progress_percentage']:.1f}% Achieved)")
        print(f"  Remaining Needed: PKR {goal['remaining_needed']:,.2f}")

    print("=" * 65)

def main():
    db_mgr = DatabaseManager()
    trans_svc = TransactionService(db_mgr)
    budget_svc = BudgetService(db_mgr)
    forecast_svc = ForecastService(db_mgr)

    seed_sample_data_if_empty(db_mgr, trans_svc, budget_svc, forecast_svc)

    try:
        from views.main_window import MainWindow
        app = MainWindow(
            db_manager=db_mgr,
            trans_service=trans_svc,
            budget_service=budget_svc,
            forecast_service=forecast_svc
        )
        print("[System] Launching Tkinter desktop graphical interface...")
        app.mainloop()
    except Exception as e:
        print(f"\\n[Note] Desktop GUI display unavailable ({e}).")
        print("[Note] Running demonstration via console mode:\\n")
        run_cli_demo(db_mgr, trans_svc, budget_svc, forecast_svc)

if __name__ == "__main__":
    main()
`,"config.py":`"""
Configuration settings for Personal Finance Manager
Tailored for IB CS SL Internal Assessment (Hostel Medical Student Client)
Modern Dark Slate UI Theme
"""

APP_TITLE = "Personal Finance Manager (Hostel Edition) - Offline Desktop"
WINDOW_WIDTH = 1120
WINDOW_HEIGHT = 740

# Client Defaults
DEFAULT_MONTHLY_STIPEND = 40000.0  # PKR
CURRENCY_SYMBOL = "PKR"

# Predefined Categories (Criterion 2)
PREDEFINED_CATEGORIES = [
    ("Food & Mess", "expense"),
    ("Transport / Fuel", "expense"),
    ("Education & Books", "expense"),
    ("Personal Care & Laundry", "expense"),
    ("Entertainment", "expense"),
    ("Miscellaneous", "expense"),
    ("Monthly Stipend", "income"),
    ("Other Allowance", "income")
]

# Suggested Budget Allocation Ratios (Criterion 11)
SUGGESTED_RATIOS = {
    "Food & Mess": 0.40,
    "Transport / Fuel": 0.15,
    "Education & Books": 0.15,
    "Personal Care & Laundry": 0.15,
    "Miscellaneous": 0.15
}

# Modern Dark Slate Theme Colors (Matching High-End Web Interface)
COLORS = {
    "bg_main": "#0B0F19",       # Deep Void Slate
    "card_bg": "#131B2E",       # Elevated Dark Card Surface
    "card_border": "#1E293B",   # Hairline Slate Border
    "sidebar_bg": "#070A12",    # Ultra-Dark Sidebar
    "sidebar_active": "#0284C7",# Active Nav Cyan Blue
    "primary": "#0284C7",       # Sky Blue Accent
    "primary_hover": "#0369A1",
    "accent": "#0D9488",        # Teal Accent
    "text_bright": "#F8FAFC",   # Bright White Heading
    "text_dark": "#F1F5F9",     # Light Text for Dark Mode
    "text_muted": "#94A3B8",    # Muted Slate Gray
    "danger": "#F43F5E",        # Modern Rose Red
    "danger_bg": "#3B1219",
    "warning": "#F59E0B",       # Warm Amber
    "warning_bg": "#36220B",
    "success": "#10B981",       # Emerald Green
    "success_bg": "#0B2E1E"
}
`,"database/schema.sql":`-- Database schema DDL for Personal Finance Manager
-- Target: SQLite3

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    is_predefined INTEGER NOT NULL DEFAULT 0 CHECK(is_predefined IN (0, 1))
);

-- Budgets Table (Monthly category limit)
CREATE TABLE IF NOT EXISTS budgets (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    month_year TEXT NOT NULL CHECK(length(month_year) = 7), -- 'YYYY-MM'
    allocated_amount REAL NOT NULL CHECK(allocated_amount >= 0),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    UNIQUE(category_id, month_year)
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL CHECK(amount > 0),
    trans_date TEXT NOT NULL, -- 'YYYY-MM-DD'
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

-- Savings Goals Table
CREATE TABLE IF NOT EXISTS savings_goals (
    goal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_name TEXT NOT NULL,
    target_amount REAL NOT NULL CHECK(target_amount > 0),
    target_date TEXT NOT NULL, -- 'YYYY-MM-DD'
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1))
);
`,"database/db_manager.py":`"""
Database Access Layer (DAO) for Personal Finance Manager
Handles SQLite connection, table initialization, and seeding.
"""

import os
import sqlite3
from config import PREDEFINED_CATEGORIES

class DatabaseManager:
    def __init__(self, db_path=None):
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.db_path = os.path.join(base_dir, "finance.db")
        else:
            self.db_path = db_path
        self._init_db()

    def get_connection(self):
        """Returns a SQLite connection with foreign keys enabled and Row factory."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_db(self):
        """Initializes tables from schema.sql and seeds predefined categories."""
        schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
        with open(schema_file, "r", encoding="utf-8") as f:
            ddl_script = f.read()

        with self.get_connection() as conn:
            conn.executescript(ddl_script)
            cursor = conn.cursor()

            # Seed predefined categories if they don't exist
            for cat_name, cat_type in PREDEFINED_CATEGORIES:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO categories (name, type, is_predefined)
                    VALUES (?, ?, 1)
                    """,
                    (cat_name, cat_type)
                )
            conn.commit()

    def get_all_categories(self, category_type=None):
        """Retrieves categories, optionally filtered by type ('income' or 'expense')."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if category_type:
                cursor.execute(
                    "SELECT * FROM categories WHERE type = ? ORDER BY name ASC",
                    (category_type,)
                )
            else:
                cursor.execute("SELECT * FROM categories ORDER BY type ASC, name ASC")
            return [dict(row) for row in cursor.fetchall()]

    def add_category(self, name, category_type):
        """Adds a new custom category. Raises ValueError if duplicate."""
        cleaned_name = name.strip()
        if not cleaned_name:
            raise ValueError("Category name cannot be empty.")
        if category_type not in ('income', 'expense'):
            raise ValueError("Category type must be 'income' or 'expense'.")

        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO categories (name, type, is_predefined) VALUES (?, ?, 0)",
                    (cleaned_name, category_type)
                )
                conn.commit()
                return cursor.lastrowid
        except sqlite3.IntegrityError:
            raise ValueError(f"Category '{cleaned_name}' already exists.")
`,"services/transaction_service.py":`"""
Transaction Service
Handles business logic, validation, and querying for financial transactions.
Satisfies Success Criteria: 1, 8, 9.
"""

from datetime import datetime
import csv

class TransactionService:
    def __init__(self, db_manager):
        self.db = db_manager

    def validate_and_record_transaction(self, amount, trans_date, description, category_id):
        """
        Validates input fields and saves a transaction to the database.
        Returns the inserted transaction_id.
        """
        # 1. Validate Amount
        try:
            val_amount = float(amount)
        except (ValueError, TypeError):
            raise ValueError("Amount must be a valid numeric value.")
        if val_amount <= 0:
            raise ValueError("Transaction amount must be strictly greater than 0.")

        # 2. Validate Date Format (YYYY-MM-DD)
        try:
            parsed_date = datetime.strptime(trans_date.strip(), "%Y-%m-%d")
            clean_date = parsed_date.strftime("%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in valid YYYY-MM-DD format.")

        # 3. Validate Description
        clean_desc = description.strip()
        if not clean_desc:
            raise ValueError("Description cannot be empty.")

        # 4. Validate Category ID
        try:
            val_cat_id = int(category_id)
        except (ValueError, TypeError):
            raise ValueError("Invalid category selected.")

        # Insert into database
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO transactions (amount, trans_date, description, category_id)
                VALUES (?, ?, ?, ?)
                """,
                (round(val_amount, 2), clean_date, clean_desc, val_cat_id)
            )
            conn.commit()
            return cursor.lastrowid

    def get_recent_transactions(self, limit=10):
        """Fetches the most recent transactions with joined category details."""
        query = """
            SELECT t.transaction_id, t.amount, t.trans_date, t.description, 
                   c.category_id, c.name AS category_name, c.type AS category_type
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            ORDER BY t.trans_date DESC, t.transaction_id DESC
            LIMIT ?
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (limit,))
            return [dict(row) for row in cursor.fetchall()]

    def search_transactions(self, keyword=None, category_id=None, start_date=None, end_date=None):
        """
        Searches transactions with dynamic parameter filtering (Criterion 9).
        Safely builds parameterized queries to prevent SQL injection.
        """
        query = """
            SELECT t.transaction_id, t.amount, t.trans_date, t.description,
                   c.name AS category_name, c.type AS category_type
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE 1=1
        """
        params = []

        if keyword and keyword.strip():
            query += " AND t.description LIKE ?"
            params.append(f"%{keyword.strip()}%")

        if category_id and str(category_id) != "ALL":
            query += " AND t.category_id = ?"
            params.append(int(category_id))

        if start_date and start_date.strip():
            query += " AND t.trans_date >= ?"
            params.append(start_date.strip())

        if end_date and end_date.strip():
            query += " AND t.trans_date <= ?"
            params.append(end_date.strip())

        query += " ORDER BY t.trans_date DESC, t.transaction_id DESC"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            return [dict(row) for row in cursor.fetchall()]

    def delete_transaction(self, transaction_id):
        """Deletes a specific transaction by ID."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM transactions WHERE transaction_id = ?", (transaction_id,))
            conn.commit()
            return cursor.rowcount > 0

    def export_to_csv(self, file_path, transactions_list):
        """Exports a list of transaction dictionaries to a CSV file."""
        if not transactions_list:
            raise ValueError("No transaction records available to export.")

        fieldnames = ["transaction_id", "trans_date", "category_type", "category_name", "description", "amount"]
        with open(file_path, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in transactions_list:
                writer.writerow({
                    "transaction_id": row.get("transaction_id"),
                    "trans_date": row.get("trans_date"),
                    "category_type": row.get("category_type"),
                    "category_name": row.get("category_name"),
                    "description": row.get("description"),
                    "amount": row.get("amount")
                })
`,"services/budget_service.py":`"""
Budget Service
Manages monthly category spending ceilings, remaining balance tracking, 80% alerts,
and rule-based budget suggestions.
Satisfies Success Criteria: 3, 4, 6, 11.
"""

from config import SUGGESTED_RATIOS

class BudgetService:
    def __init__(self, db_manager):
        self.db = db_manager

    def set_budget(self, category_id, month_year, allocated_amount):
        """Sets or updates a budget ceiling for a specific category and month."""
        try:
            amt = float(allocated_amount)
        except (ValueError, TypeError):
            raise ValueError("Allocated budget must be a valid number.")

        if amt < 0:
            raise ValueError("Budget allocation cannot be negative.")

        if len(month_year) != 7 or month_year[4] != "-":
            raise ValueError("Month format must be YYYY-MM (e.g. 2026-10).")

        query = """
            INSERT INTO budgets (category_id, month_year, allocated_amount)
            VALUES (?, ?, ?)
            ON CONFLICT(category_id, month_year) 
            DO UPDATE SET allocated_amount = excluded.allocated_amount
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (int(category_id), month_year, round(amt, 2)))
            conn.commit()

    def get_monthly_budget_status(self, month_year):
        """
        Calculates remaining budget and percentage spent for all expense categories in month_year.
        Satisfies Criterion 4.
        """
        query = """
            SELECT c.category_id, c.name AS category_name,
                   COALESCE(b.allocated_amount, 0.0) AS allocated_amount,
                   COALESCE(SUM(t.amount), 0.0) AS spent_amount
            FROM categories c
            LEFT JOIN budgets b ON c.category_id = b.category_id AND b.month_year = ?
            LEFT JOIN transactions t ON c.category_id = t.category_id 
                 AND strftime('%Y-%m', t.trans_date) = ?
            WHERE c.type = 'expense'
            GROUP BY c.category_id, c.name, b.allocated_amount
            ORDER BY c.name ASC
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (month_year, month_year))
            rows = cursor.fetchall()

        results = []
        for r in rows:
            allocated = float(r["allocated_amount"])
            spent = float(r["spent_amount"])
            remaining = allocated - spent
            pct_used = (spent / allocated * 100.0) if allocated > 0 else (100.0 if spent > 0 else 0.0)

            results.append({
                "category_id": r["category_id"],
                "category_name": r["category_name"],
                "allocated": round(allocated, 2),
                "spent": round(spent, 2),
                "remaining": round(remaining, 2),
                "percentage_used": round(pct_used, 1)
            })
        return results

    def check_threshold_alerts(self, month_year):
        """
        Evaluates 80% and over-budget alerts (Criterion 6).
        Returns list of alert dictionaries with level ('WARNING' or 'DANGER').
        """
        budget_statuses = self.get_monthly_budget_status(month_year)
        alerts = []

        for item in budget_statuses:
            allocated = item["allocated"]
            spent = item["spent"]
            if allocated > 0:
                ratio = spent / allocated
                if ratio >= 1.0:
                    overage = spent - allocated
                    alerts.append({
                        "category": item["category_name"],
                        "level": "DANGER",
                        "message": f"Over budget by {overage:,.2f} PKR! ({item['percentage_used']}%)",
                        "percentage": item["percentage_used"]
                    })
                elif ratio >= 0.80:
                    remaining = allocated - spent
                    alerts.append({
                        "category": item["category_name"],
                        "level": "WARNING",
                        "message": f"80% threshold reached! Only {remaining:,.2f} PKR remaining ({item['percentage_used']}%).",
                        "percentage": item["percentage_used"]
                    })
        return alerts

    def suggest_budget_distribution(self, monthly_income, target_monthly_savings):
        """
        Suggests category allocations from disposable pool (Criterion 11).
        Formula: Pool = Income - Savings. Allocates based on standard student living weights.
        """
        try:
            inc = float(monthly_income)
            sav = float(target_monthly_savings)
        except (ValueError, TypeError):
            raise ValueError("Income and savings targets must be valid numbers.")

        if sav >= inc:
            raise ValueError("Target monthly savings must be strictly less than monthly income.")
        if sav < 0 or inc <= 0:
            raise ValueError("Amounts must be positive.")

        spending_pool = inc - sav
        suggested = {}
        allocated_running_sum = 0.0

        for cat_name, ratio in SUGGESTED_RATIOS.items():
            amount = round(spending_pool * ratio, 0)
            suggested[cat_name] = amount
            allocated_running_sum += amount

        # Compensate for rounding difference in the Miscellaneous category
        discrepancy = round(spending_pool - allocated_running_sum, 0)
        if "Miscellaneous" in suggested:
            suggested["Miscellaneous"] += discrepancy

        return {
            "spending_pool": spending_pool,
            "allocations": suggested
        }
`,"services/forecast_service.py":`"""
Forecast & Goal Service
Handles predictive savings projections and multi-month goal tracking.
Satisfies Success Criteria: 7, 10, 12.
"""

import calendar
from datetime import datetime

class ForecastService:
    def __init__(self, db_manager):
        self.db = db_manager

    def forecast_month_end(self, month_year, expected_income, as_of_date_str=None):
        """
        Estimates end-of-month savings using the Daily Burn Rate formula.
        Satisfies Criterion 7.
        """
        year, month = map(int, month_year.split("-"))
        total_days_in_month = calendar.monthrange(year, month)[1]

        # Determine evaluation day
        if as_of_date_str:
            eval_date = datetime.strptime(as_of_date_str, "%Y-%m-%d")
            eval_day = eval_date.day
        else:
            now = datetime.now()
            if now.year == year and now.month == month:
                eval_day = now.day
            else:
                eval_day = total_days_in_month  # Month completed

        eval_day = max(1, min(eval_day, total_days_in_month))

        # Query total expenses in this month up to evaluation day
        query = """
            SELECT COALESCE(SUM(t.amount), 0.0) AS total_expense
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE c.type = 'expense'
              AND strftime('%Y-%m', t.trans_date) = ?
              AND CAST(strftime('%d', t.trans_date) AS INTEGER) <= ?
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (month_year, eval_day))
            row = cursor.fetchone()
            total_spent_so_far = float(row["total_expense"]) if row else 0.0

        daily_burn_rate = total_spent_so_far / eval_day
        projected_total_expense = daily_burn_rate * total_days_in_month
        projected_savings = expected_income - projected_total_expense

        return {
            "eval_day": eval_day,
            "total_days_in_month": total_days_in_month,
            "days_remaining": total_days_in_month - eval_day,
            "spent_so_far": round(total_spent_so_far, 2),
            "daily_burn_rate": round(daily_burn_rate, 2),
            "projected_expense": round(projected_total_expense, 2),
            "projected_savings": round(projected_savings, 2)
        }

    def get_savings_goal_progress(self):
        """
        Computes progress toward the active savings goal based on lifetime net savings.
        Satisfies Criterion 12.
        """
        # Fetch active goal
        query_goal = "SELECT * FROM savings_goals WHERE is_active = 1 ORDER BY goal_id DESC LIMIT 1"
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query_goal)
            goal_row = cursor.fetchone()

            if not goal_row:
                return None

            goal = dict(goal_row)

            # Calculate lifetime income and expenses
            cursor.execute("""
                SELECT 
                    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0.0) AS total_income,
                    COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0.0) AS total_expense
                FROM transactions t
                JOIN categories c ON t.category_id = c.category_id
            """)
            totals = cursor.fetchone()
            net_saved = float(totals["total_income"]) - float(totals["total_expense"])

        target = float(goal["target_amount"])
        # Protect against negative saved amount for progress bar
        effective_saved = max(0.0, net_saved)
        progress_pct = (effective_saved / target * 100.0) if target > 0 else 0.0
        remaining_needed = max(0.0, target - effective_saved)

        return {
            "goal_id": goal["goal_id"],
            "goal_name": goal["goal_name"],
            "target_amount": target,
            "target_date": goal["target_date"],
            "net_saved": round(net_saved, 2),
            "effective_saved": round(effective_saved, 2),
            "remaining_needed": round(remaining_needed, 2),
            "progress_percentage": min(100.0, round(progress_pct, 1)),
            "is_achieved": net_saved >= target
        }

    def set_savings_goal(self, name, target_amount, target_date):
        """Creates or replaces the active savings goal."""
        try:
            amt = float(target_amount)
        except (ValueError, TypeError):
            raise ValueError("Target amount must be a valid number.")

        if amt <= 0:
            raise ValueError("Target amount must be strictly greater than 0.")

        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Goal name cannot be empty.")

        datetime.strptime(target_date.strip(), "%Y-%m-%d")

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            # Deactivate previous goals
            cursor.execute("UPDATE savings_goals SET is_active = 0 WHERE is_active = 1")
            cursor.execute(
                """
                INSERT INTO savings_goals (goal_name, target_amount, target_date, is_active)
                VALUES (?, ?, ?, 1)
                """,
                (clean_name, round(amt, 2), target_date.strip())
            )
            conn.commit()
`,"views/main_window.py":`"""
Main Window Controller for Personal Finance Manager
Modern Dark Slate UI with Sidebar Navigation and Stacked Frames
"""

import tkinter as tk
from tkinter import ttk
from config import APP_TITLE, WINDOW_WIDTH, WINDOW_HEIGHT, COLORS

class MainWindow(tk.Tk):
    def __init__(self, db_manager, trans_service, budget_service, forecast_service):
        super().__init__()
        self.title(APP_TITLE)
        self.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        self.minsize(1020, 680)
        self.configure(bg=COLORS["bg_main"])

        # Inject services
        self.db = db_manager
        self.trans_service = trans_service
        self.budget_service = budget_service
        self.forecast_service = forecast_service

        self._setup_modern_styles()
        self._build_layout()

    def _setup_modern_styles(self):
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass

        font_family = "Segoe UI" if "Segoe UI" in tk.font.families() else ("SF Pro Display" if "SF Pro Display" in tk.font.families() else "Helvetica")

        # Global modern dark styling
        style.configure(".", font=(font_family, 10), background=COLORS["bg_main"], foreground=COLORS["text_dark"])
        style.configure("TFrame", background=COLORS["bg_main"])
        style.configure("Card.TFrame", background=COLORS["card_bg"])
        
        # Modern Treeview Styling
        style.configure(
            "Treeview",
            background=COLORS["card_bg"],
            foreground=COLORS["text_bright"],
            fieldbackground=COLORS["card_bg"],
            rowheight=32,
            font=(font_family, 9),
            borderwidth=0
        )
        style.configure(
            "Treeview.Heading",
            background=COLORS["card_border"],
            foreground=COLORS["text_muted"],
            font=(font_family, 9, "bold"),
            relief="flat",
            padding=6
        )
        style.map("Treeview", background=[("selected", COLORS["primary"])], foreground=[("selected", "#FFFFFF")])
        
        # Modern Progressbar
        style.configure(
            "Horizontal.TProgressbar",
            troughcolor=COLORS["card_border"],
            background=COLORS["primary"],
            darkcolor=COLORS["primary"],
            lightcolor=COLORS["primary"],
            bordercolor=COLORS["card_border"],
            thickness=10
        )

        # Modern Entry & Combobox
        style.configure("TEntry", fieldbackground=COLORS["card_bg"], foreground=COLORS["text_bright"], bordercolor=COLORS["card_border"])
        style.configure("TCombobox", fieldbackground=COLORS["card_bg"], foreground=COLORS["text_bright"])

    def _build_layout(self):
        self.columnconfigure(0, weight=0, minsize=240)
        self.columnconfigure(1, weight=1)
        self.rowconfigure(0, weight=1)

        # 1. Left Sidebar
        self.sidebar = tk.Frame(self, bg=COLORS["sidebar_bg"], width=240)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_propagate(False)

        # Brand Header
        brand_frame = tk.Frame(self.sidebar, bg=COLORS["sidebar_bg"], padx=18, pady=20)
        brand_frame.pack(fill="x")

        lbl_brand = tk.Label(
            brand_frame,
            text="FINANCE MANAGER",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 13, "bold"),
            fg="#38BDF8",
            bg=COLORS["sidebar_bg"],
            anchor="w"
        )
        lbl_brand.pack(fill="x")

        lbl_sub = tk.Label(
            brand_frame,
            text="Hostel Medical Student Edition\\nStipend: 40,000 PKR / mo",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8),
            fg=COLORS["text_muted"],
            bg=COLORS["sidebar_bg"],
            justify="left",
            pady=4,
            anchor="w"
        )
        lbl_sub.pack(fill="x")

        lbl_badge = tk.Label(
            brand_frame,
            text="● 100% Offline Device Mode",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8, "bold"),
            fg="#34D399",
            bg="#0B2E1E",
            padx=8,
            pady=3,
            anchor="w"
        )
        lbl_badge.pack(anchor="w", pady=(6, 0))

        # Nav Buttons Container
        nav_container = tk.Frame(self.sidebar, bg=COLORS["sidebar_bg"], padx=10, pady=10)
        nav_container.pack(fill="both", expand=True)

        # 2. Main Content Container
        self.content_container = tk.Frame(self, bg=COLORS["bg_main"])
        self.content_container.grid(row=0, column=1, sticky="nsew")
        self.content_container.columnconfigure(0, weight=1)
        self.content_container.rowconfigure(0, weight=1)

        from views.dashboard_view import DashboardView
        from views.transaction_view import TransactionView
        from views.budget_view import BudgetView
        from views.chart_view import ChartView
        from views.history_view import HistoryView
        from views.goal_view import GoalView

        self.frames = {}
        views = [
            ("Dashboard", DashboardView, "📊"),
            ("Log Transaction", TransactionView, "✍️"),
            ("Monthly Budgets", BudgetView, "🎯"),
            ("Visual Analytics", ChartView, "📈"),
            ("Search & History", HistoryView, "🔍"),
            ("Savings Goal", GoalView, "🏆")
        ]

        self.nav_buttons = {}
        for title, view_cls, icon in views:
            btn = tk.Button(
                nav_container,
                text=f"  {icon}  {title}",
                anchor="w",
                font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 10),
                fg=COLORS["text_muted"],
                bg=COLORS["sidebar_bg"],
                activebackground=COLORS["primary"],
                activeforeground="#FFFFFF",
                bd=0,
                padx=14,
                pady=11,
                cursor="hand2",
                command=lambda cls=view_cls: self.show_frame(cls)
            )
            btn.pack(fill="x", pady=2)
            self.nav_buttons[view_cls] = btn

            frame = view_cls(parent=self.content_container, controller=self)
            self.frames[view_cls] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        # Footer
        lbl_foot = tk.Label(
            self.sidebar,
            text="IB CS SL Internal Assessment\\nCriterion B & E Solution",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8),
            fg="#64748B",
            bg=COLORS["sidebar_bg"],
            pady=16
        )
        lbl_foot.pack(side="bottom", fill="x")

        self.show_frame(DashboardView)

    def show_frame(self, view_class):
        frame = self.frames[view_class]
        frame.tkraise()
        for cls, btn in self.nav_buttons.items():
            if cls == view_class:
                btn.configure(
                    bg="#1E293B",
                    fg="#38BDF8",
                    font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 10, "bold")
                )
            else:
                btn.configure(
                    bg=COLORS["sidebar_bg"],
                    fg=COLORS["text_muted"],
                    font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 10)
                )
        if hasattr(frame, "refresh_data"):
            frame.refresh_data()
`,"views/dashboard_view.py":`"""
Dashboard View (Modern Dark Slate Edition)
Presents executive financial indicators: Total spend, remaining budget, predicted savings,
threshold alert banners, and budget status table.
"""

import tkinter as tk
from tkinter import ttk
from datetime import datetime
from config import COLORS, CURRENCY_SYMBOL, DEFAULT_MONTHLY_STIPEND

class DashboardView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self.current_month = datetime.now().strftime("%Y-%m")
        self._build_ui()

    def _build_ui(self):
        # Header
        header_frame = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header_frame.pack(fill="x")

        lbl_title = tk.Label(
            header_frame,
            text=f"Financial Overview • {self.current_month}",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        )
        lbl_title.pack(side="left")

        btn_refresh = tk.Button(
            header_frame,
            text="↻ Refresh Data",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bg="#1E293B",
            fg="#38BDF8",
            activebackground="#0284C7",
            activeforeground="#FFFFFF",
            bd=0,
            padx=14,
            pady=6,
            cursor="hand2",
            command=self.refresh_data
        )
        btn_refresh.pack(side="right")

        # Top 4 KPI Cards Container
        cards_frame = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        cards_frame.pack(fill="x", pady=4)
        for i in range(4):
            cards_frame.columnconfigure(i, weight=1)

        self.card_stipend = self._create_card(cards_frame, 0, "MONTHLY STIPEND", f"{DEFAULT_MONTHLY_STIPEND:,.0f} {CURRENCY_SYMBOL}", "#38BDF8")
        self.card_spent = self._create_card(cards_frame, 1, "TOTAL SPENT (OCT)", "0.00 PKR", COLORS["text_bright"])
        self.card_remaining = self._create_card(cards_frame, 2, "REMAINING BUDGET", "0.00 PKR", "#2DD4BF")
        self.card_forecast = self._create_card(cards_frame, 3, "PRED. SAVINGS", "0.00 PKR", "#34D399")

        # Alert Banner Frame
        self.alert_frame = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        self.alert_frame.pack(fill="x", pady=(12, 0))

        # Split Layout: Budget Consumption + Recent Transactions
        split_frame = tk.Frame(self, bg=COLORS["bg_main"], padx=24, pady=12)
        split_frame.pack(fill="both", expand=True)
        split_frame.columnconfigure(0, weight=3)
        split_frame.columnconfigure(1, weight=2)
        split_frame.rowconfigure(0, weight=1)

        # Left Column: Category Budget Health
        budget_panel = tk.Frame(split_frame, bg=COLORS["card_bg"], padx=14, pady=14)
        budget_panel.grid(row=0, column=0, sticky="nsew", padx=(0, 10))

        tk.Label(
            budget_panel,
            text="Category Budget Consumption (Criterion 4)",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        cols = ("category", "budget", "spent", "remaining", "pct")
        self.budget_tree = ttk.Treeview(budget_panel, columns=cols, show="headings", height=8)
        self.budget_tree.heading("category", text="Category")
        self.budget_tree.heading("budget", text="Limit (PKR)")
        self.budget_tree.heading("spent", text="Spent (PKR)")
        self.budget_tree.heading("remaining", text="Remaining")
        self.budget_tree.heading("pct", text="Used %")

        self.budget_tree.column("category", width=140, anchor="w")
        self.budget_tree.column("budget", width=85, anchor="e")
        self.budget_tree.column("spent", width=85, anchor="e")
        self.budget_tree.column("remaining", width=85, anchor="e")
        self.budget_tree.column("pct", width=65, anchor="center")

        self.budget_tree.pack(side="left", fill="both", expand=True)

        # Right Column: Recent Transactions
        recents_panel = tk.Frame(split_frame, bg=COLORS["card_bg"], padx=14, pady=14)
        recents_panel.grid(row=0, column=1, sticky="nsew")

        tk.Label(
            recents_panel,
            text="Recent Activity Log",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        r_cols = ("date", "category", "amount")
        self.recent_tree = ttk.Treeview(recents_panel, columns=r_cols, show="headings", height=8)
        self.recent_tree.heading("date", text="Date")
        self.recent_tree.heading("category", text="Category")
        self.recent_tree.heading("amount", text="Amount")

        self.recent_tree.column("date", width=85, anchor="center")
        self.recent_tree.column("category", width=110, anchor="w")
        self.recent_tree.column("amount", width=80, anchor="e")

        self.recent_tree.pack(side="left", fill="both", expand=True)

    def _create_card(self, parent, col, title, value, color):
        frame = tk.Frame(parent, bg=COLORS["card_bg"], padx=16, pady=14)
        frame.grid(row=0, column=col, padx=5, sticky="ew")

        lbl_t = tk.Label(
            frame,
            text=title,
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8, "bold"),
            fg=COLORS["text_muted"],
            bg=COLORS["card_bg"]
        )
        lbl_t.pack(anchor="w")

        lbl_v = tk.Label(
            frame,
            text=value,
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 15, "bold"),
            fg=color,
            bg=COLORS["card_bg"]
        )
        lbl_v.pack(anchor="w", pady=(4, 0))
        return lbl_v

    def refresh_data(self):
        statuses = self.controller.budget_service.get_monthly_budget_status(self.current_month)
        total_allocated = sum(s["allocated"] for s in statuses)
        total_spent = sum(s["spent"] for s in statuses)
        net_remaining = total_allocated - total_spent

        forecast = self.controller.forecast_service.forecast_month_end(self.current_month, DEFAULT_MONTHLY_STIPEND)

        self.card_spent.config(text=f"{total_spent:,.2f} {CURRENCY_SYMBOL}")
        self.card_remaining.config(
            text=f"{net_remaining:,.2f} {CURRENCY_SYMBOL}",
            fg="#2DD4BF" if net_remaining >= 0 else COLORS["danger"]
        )
        self.card_forecast.config(
            text=f"{forecast['projected_savings']:,.2f} {CURRENCY_SYMBOL}",
            fg="#34D399" if forecast["projected_savings"] >= 0 else COLORS["danger"]
        )

        # Alerts
        alerts = self.controller.budget_service.check_threshold_alerts(self.current_month)
        for w in self.alert_frame.winfo_children():
            w.destroy()

        if alerts:
            for alert in alerts:
                bg_col = COLORS["danger_bg"] if alert["level"] == "DANGER" else COLORS["warning_bg"]
                fg_col = "#FDA4AF" if alert["level"] == "DANGER" else "#FDE68A"
                icon = "🚨 OVER BUDGET" if alert["level"] == "DANGER" else "⚠️ 80% THRESHOLD WARNING"

                lbl = tk.Label(
                    self.alert_frame,
                    text=f"  {icon}: [{alert['category']}] {alert['message']}",
                    font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
                    fg=fg_col,
                    bg=bg_col,
                    padx=14,
                    pady=8,
                    anchor="w"
                )
                lbl.pack(fill="x", pady=2)

        # Populate Budget Tree
        for item in self.budget_tree.get_children():
            self.budget_tree.delete(item)

        for s in statuses:
            self.budget_tree.insert(
                "",
                "end",
                values=(
                    s["category_name"],
                    f"{s['allocated']:,.0f}",
                    f"{s['spent']:,.0f}",
                    f"{s['remaining']:,.0f}",
                    f"{s['percentage_used']}%"
                )
            )

        # Populate Recent Tree
        for item in self.recent_tree.get_children():
            self.recent_tree.delete(item)

        recents = self.controller.trans_service.get_recent_transactions(limit=10)
        for r in recents:
            prefix = "-" if r["category_type"] == "expense" else "+"
            self.recent_tree.insert(
                "",
                "end",
                values=(
                    r["trans_date"],
                    r["category_name"],
                    f"{prefix}{r['amount']:,.0f} PKR"
                )
            )
`,"views/transaction_view.py":`"""
Transaction View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
from config import COLORS, CURRENCY_SYMBOL

class TransactionView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")
        tk.Label(
            header,
            text="Record Income / Expense",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        content = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=1)
        content.columnconfigure(1, weight=1)

        # Form Card
        form_card = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        form_card.grid(row=0, column=0, sticky="nsew", padx=(0, 12), pady=(0, 20))

        tk.Label(
            form_card,
            text="New Entry",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        # Type Selector
        self.var_type = tk.StringVar(value="expense")
        t_frame = tk.Frame(form_card, bg=COLORS["card_bg"])
        t_frame.pack(anchor="w", pady=(0, 12))
        tk.Radiobutton(
            t_frame, text="Expense (-)", variable=self.var_type, value="expense",
            bg=COLORS["card_bg"], fg=COLORS["text_bright"], selectcolor="#0E1526",
            command=self.refresh_data
        ).pack(side="left", padx=(0, 14))
        tk.Radiobutton(
            t_frame, text="Income / Stipend (+)", variable=self.var_type, value="income",
            bg=COLORS["card_bg"], fg=COLORS["text_bright"], selectcolor="#0E1526",
            command=self.refresh_data
        ).pack(side="left")

        tk.Label(form_card, text=f"Amount ({CURRENCY_SYMBOL}):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_amt = ttk.Entry(form_card)
        self.ent_amt.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Date (YYYY-MM-DD):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_date = ttk.Entry(form_card)
        self.ent_date.insert(0, datetime.now().strftime("%Y-%m-%d"))
        self.ent_date.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Category:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.combo_cat = ttk.Combobox(form_card, state="readonly")
        self.combo_cat.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Description / Memo:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_desc = ttk.Entry(form_card)
        self.ent_desc.pack(fill="x", pady=(2, 16))

        tk.Button(
            form_card,
            text="💾 Save Transaction Offline",
            bg=COLORS["primary"],
            fg="#FFFFFF",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bd=0,
            pady=9,
            cursor="hand2",
            command=self._save
        ).pack(fill="x")

        # Right: Activity Log
        r_panel = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        r_panel.grid(row=0, column=1, sticky="nsew", pady=(0, 20))

        tk.Label(
            r_panel,
            text="Recent Records",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        cols = ("id", "date", "cat", "desc", "amt")
        self.tree = ttk.Treeview(r_panel, columns=cols, show="headings", height=12)
        self.tree.heading("id", text="#")
        self.tree.heading("date", text="Date")
        self.tree.heading("cat", text="Category")
        self.tree.heading("desc", text="Description")
        self.tree.heading("amt", text="Amount")

        self.tree.column("id", width=30, anchor="center")
        self.tree.column("date", width=80, anchor="center")
        self.tree.column("cat", width=110, anchor="w")
        self.tree.column("desc", width=130, anchor="w")
        self.tree.column("amt", width=80, anchor="e")

        self.tree.pack(fill="both", expand=True)

    def _save(self):
        cat_name = self.combo_cat.get()
        cats = self.controller.db.get_all_categories()
        cid = next((c["category_id"] for c in cats if c["name"] == cat_name), None)
        try:
            self.controller.trans_service.validate_and_record_transaction(
                self.ent_amt.get(), self.ent_date.get(), self.ent_desc.get(), cid
            )
            messagebox.showinfo("Success", "Transaction recorded successfully!")
            self.ent_amt.delete(0, tk.END)
            self.ent_desc.delete(0, tk.END)
            self.refresh_data()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def refresh_data(self):
        cats = self.controller.db.get_all_categories(self.var_type.get())
        self.combo_cat["values"] = [c["name"] for c in cats]
        if cats: self.combo_cat.current(0)
        for i in self.tree.get_children(): self.tree.delete(i)
        for r in self.controller.trans_service.get_recent_transactions(15):
            prefix = "-" if r["category_type"] == "expense" else "+"
            self.tree.insert("", "end", values=(r["transaction_id"], r["trans_date"], r["category_name"], r["description"], f"{prefix}{r['amount']:,.0f}"))
`,"views/budget_view.py":`"""
Budget Setup View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
from config import COLORS, CURRENCY_SYMBOL

class BudgetView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self.entries = {}
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")
        tk.Label(
            header,
            text="Monthly Budget Allocation",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        content = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=1)
        content.columnconfigure(1, weight=1)

        # Quick Suggester
        s_box = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        s_box.grid(row=0, column=0, sticky="nsew", padx=(0, 12), pady=(0, 20))

        tk.Label(s_box, text="Quick Allocation Assistant", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"), fg=COLORS["text_bright"], bg=COLORS["card_bg"]).pack(anchor="w", pady=(0, 10))

        tk.Label(s_box, text="Monthly Stipend (PKR):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_stipend = ttk.Entry(s_box)
        self.ent_stipend.insert(0, "40000")
        self.ent_stipend.pack(fill="x", pady=(2, 8))

        tk.Label(s_box, text="Target Monthly Savings (PKR):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_sav = ttk.Entry(s_box)
        self.ent_sav.insert(0, "6000")
        self.ent_sav.pack(fill="x", pady=(2, 14))

        tk.Button(
            s_box,
            text="✨ Auto-Suggest Student Limits (40/15/15/15/15)",
            bg="#D97706",
            fg="#FFFFFF",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bd=0,
            pady=8,
            cursor="hand2",
            command=self._suggest
        ).pack(fill="x")

        # Category Limits Box
        self.limits_box = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        self.limits_box.grid(row=0, column=1, sticky="nsew", pady=(0, 20))

        tk.Label(self.limits_box, text="Category Spending Ceilings", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"), fg=COLORS["text_bright"], bg=COLORS["card_bg"]).grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 10))

        self.btn_save = tk.Button(
            self.limits_box,
            text="💾 Save Budget Allocations",
            bg=COLORS["primary"],
            fg="#FFFFFF",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bd=0,
            pady=8,
            cursor="hand2",
            command=self._save_all
        )

    def _suggest(self):
        res = self.controller.budget_service.suggest_budget_distribution(self.ent_stipend.get(), self.ent_sav.get())
        for cid, (name, ent) in self.entries.items():
            if name in res["allocations"]:
                ent.delete(0, tk.END)
                ent.insert(0, str(int(res["allocations"][name])))
        messagebox.showinfo("Applied", f"Allocated {res['spending_pool']:,.0f} PKR across 5 categories! Click Save.")

    def _save_all(self):
        month = datetime.now().strftime("%Y-%m")
        for cid, (name, ent) in self.entries.items():
            try:
                self.controller.budget_service.set_budget(cid, month, ent.get())
            except Exception as e:
                messagebox.showerror("Error", str(e))
                return
        messagebox.showinfo("Success", "Budgets updated successfully!")
        self.refresh_data()

    def refresh_data(self):
        cats = self.controller.db.get_all_categories("expense")
        status = {s["category_id"]: s["allocated"] for s in self.controller.budget_service.get_monthly_budget_status(datetime.now().strftime("%Y-%m"))}

        # Clear existing dynamic entries
        for w in self.limits_box.grid_slaves():
            if int(w.grid_info()["row"]) > 0:
                w.grid_forget()

        self.entries.clear()
        row = 1
        for c in cats:
            lbl = tk.Label(self.limits_box, text=c["name"], font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"])
            lbl.grid(row=row, column=0, sticky="w", pady=4)

            ent = ttk.Entry(self.limits_box, width=12)
            ent.insert(0, str(int(status.get(c["category_id"], 0))))
            ent.grid(row=row, column=1, sticky="e", pady=4, padx=(10, 0))

            self.entries[c["category_id"]] = (c["name"], ent)
            row += 1

        self.btn_save.grid(row=row + 1, column=0, columnspan=2, sticky="ew", pady=(14, 0))
`,"views/chart_view.py":`"""
Visual Spending Analysis View (Modern Dark Theme Edition)
Embeds dark-themed Matplotlib charts directly inside Tkinter.
"""

import tkinter as tk
from tkinter import ttk
from datetime import datetime
from config import COLORS

try:
    import matplotlib
    matplotlib.use("TkAgg")
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

class ChartView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self.current_month = datetime.now().strftime("%Y-%m")
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")

        tk.Label(
            header,
            text="Visual Spending Analytics (Criterion 5)",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        # Container
        self.chart_container = tk.Frame(self, bg=COLORS["card_bg"], padx=14, pady=14)
        self.chart_container.pack(fill="both", expand=True, padx=24, pady=(0, 20))

    def refresh_data(self):
        for widget in self.chart_container.winfo_children():
            widget.destroy()

        if not MATPLOTLIB_AVAILABLE:
            tk.Label(
                self.chart_container,
                text="Install matplotlib for dark theme embedded charts:\\npip install matplotlib",
                font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12),
                fg=COLORS["text_muted"],
                bg=COLORS["card_bg"]
            ).pack(expand=True)
            return

        statuses = self.controller.budget_service.get_monthly_budget_status(self.current_month)
        categories = []
        spent_amounts = []
        budget_amounts = []

        for s in statuses:
            if s["spent"] > 0 or s["allocated"] > 0:
                categories.append(s["category_name"])
                spent_amounts.append(s["spent"])
                budget_amounts.append(s["allocated"])

        total_spent = sum(spent_amounts)

        if total_spent == 0 and sum(budget_amounts) == 0:
            tk.Label(
                self.chart_container,
                text=f"No spending records found for {self.current_month}.\\nLog some transactions first to view graphs!",
                font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12),
                fg=COLORS["text_muted"],
                bg=COLORS["card_bg"]
            ).pack(expand=True)
            return

        # Modern Dark-themed Matplotlib Figure
        fig, (ax_pie, ax_bar) = plt.subplots(1, 2, figsize=(9.6, 4.6), dpi=100)
        fig.patch.set_facecolor('#131B2E')
        ax_pie.set_facecolor('#131B2E')
        ax_bar.set_facecolor('#131B2E')

        # Palette
        palette = ['#38BDF8', '#34D399', '#FBBF24', '#F43F5E', '#A78BFA', '#F472B6']

        # Panel 1: Expenditure Pie Chart
        if total_spent > 0:
            pie_cats = [c for c, s in zip(categories, spent_amounts) if s > 0]
            pie_vals = [s for s in spent_amounts if s > 0]
            wedges, texts, autotexts = ax_pie.pie(
                pie_vals,
                labels=pie_cats,
                autopct='%1.1f%%',
                startangle=140,
                colors=palette[:len(pie_vals)],
                textprops={'fontsize': 8, 'color': '#E2E8F0'}
            )
            for autotext in autotexts:
                autotext.set_color('#0F172A')
                autotext.set_weight('bold')

            ax_pie.set_title(f"Spending Breakdown ({total_spent:,.0f} PKR)", fontsize=11, fontweight='bold', color='#F8FAFC', pad=12)
        else:
            ax_pie.text(0.5, 0.5, "No Expenses Yet", ha='center', va='center', fontsize=10, color='#94A3B8')
            ax_pie.axis('off')

        # Panel 2: Budget vs. Actual Bar Chart
        indices = range(len(categories))
        bar_width = 0.35

        ax_bar.bar([i - bar_width/2 for i in indices], budget_amounts, width=bar_width, label='Budget Limit', color='#0284C7')
        ax_bar.bar([i + bar_width/2 for i in indices], spent_amounts, width=bar_width, label='Actual Spent', color='#34D399')

        ax_bar.set_xticks(indices)
        ax_bar.set_xticklabels(categories, rotation=25, ha='right', fontsize=8, color='#94A3B8')
        ax_bar.set_ylabel("PKR", fontsize=9, color='#94A3B8')
        ax_bar.set_title("Budget vs. Actual Spending", fontsize=11, fontweight='bold', color='#F8FAFC', pad=12)
        ax_bar.legend(fontsize=8, facecolor='#1E293B', edgecolor='#334155', labelcolor='#F8FAFC')
        ax_bar.grid(axis='y', linestyle='--', alpha=0.15, color='#FFFFFF')
        ax_bar.tick_params(colors='#94A3B8')
        for spine in ax_bar.spines.values():
            spine.set_color('#1E293B')

        plt.tight_layout()

        canvas = FigureCanvasTkAgg(fig, master=self.chart_container)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        plt.close(fig)
`,"views/history_view.py":`"""
History & Search View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from config import COLORS

class HistoryView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")
        tk.Label(
            header,
            text="Transaction History & Search Filter",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        # Filter bar
        f_box = tk.Frame(self, bg=COLORS["card_bg"], padx=18, pady=14)
        f_box.pack(fill="x", padx=24, pady=(0, 14))

        tk.Label(f_box, text="Keyword:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(side="left")
        self.ent_key = ttk.Entry(f_box, width=18)
        self.ent_key.pack(side="left", padx=(6, 16))

        btn_search = tk.Button(
            f_box,
            text="🔍 Apply Filter",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bg=COLORS["primary"],
            fg="#FFFFFF",
            bd=0,
            padx=12,
            pady=4,
            cursor="hand2",
            command=self.refresh_data
        )
        btn_search.pack(side="left", padx=(0, 8))

        btn_reset = tk.Button(
            f_box,
            text="Reset",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9),
            bg="#1E293B",
            fg=COLORS["text_muted"],
            bd=0,
            padx=10,
            pady=4,
            cursor="hand2",
            command=self._reset
        )
        btn_reset.pack(side="left")

        # Treeview
        table_card = tk.Frame(self, bg=COLORS["card_bg"], padx=14, pady=14)
        table_card.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        cols = ("id", "date", "type", "cat", "desc", "amt")
        self.tree = ttk.Treeview(table_card, columns=cols, show="headings")
        self.tree.heading("id", text="#")
        self.tree.heading("date", text="Date")
        self.tree.heading("type", text="Type")
        self.tree.heading("cat", text="Category")
        self.tree.heading("desc", text="Description")
        self.tree.heading("amt", text="Amount (PKR)")

        self.tree.column("id", width=35, anchor="center")
        self.tree.column("date", width=85, anchor="center")
        self.tree.column("type", width=80, anchor="center")
        self.tree.column("cat", width=120, anchor="w")
        self.tree.column("desc", width=220, anchor="w")
        self.tree.column("amt", width=100, anchor="e")

        self.tree.pack(fill="both", expand=True)

    def _reset(self):
        self.ent_key.delete(0, tk.END)
        self.refresh_data()

    def refresh_data(self):
        for i in self.tree.get_children():
            self.tree.delete(i)
        records = self.controller.trans_service.search_transactions(keyword=self.ent_key.get())
        for r in records:
            prefix = "-" if r["category_type"] == "expense" else "+"
            self.tree.insert(
                "", "end",
                values=(
                    r["transaction_id"],
                    r["trans_date"],
                    r["category_type"].upper(),
                    r["category_name"],
                    r["description"],
                    f"{prefix}{r['amount']:,.0f}"
                )
            )
`,"views/goal_view.py":`"""
Savings Goal Tracker View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox
from config import COLORS, CURRENCY_SYMBOL

class GoalView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")

        tk.Label(
            header,
            text="Savings Goal Tracker (Criterion 12)",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        # Container
        content = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=3)
        content.columnconfigure(1, weight=2)

        # Left: Progress Card
        card = tk.Frame(content, bg=COLORS["card_bg"], padx=20, pady=20)
        card.grid(row=0, column=0, sticky="nsew", padx=(0, 12), pady=(0, 20))

        tk.Label(
            card,
            text="ACTIVE MILESTONE",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8, "bold"),
            fg=COLORS["text_muted"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w")

        self.lbl_goal = tk.Label(
            card,
            text="Littmann Classic III Stethoscope",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg="#38BDF8",
            bg=COLORS["card_bg"]
        )
        self.lbl_goal.pack(anchor="w", pady=(4, 14))

        # Progress bar
        self.bar = ttk.Progressbar(card, orient="horizontal", mode="determinate", length=400, maximum=100)
        self.bar.pack(fill="x", pady=6)

        self.lbl_pct = tk.Label(
            card,
            text="76.0% Achieved",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg="#34D399",
            bg=COLORS["card_bg"]
        )
        self.lbl_pct.pack(anchor="e")

        # Metric grid
        m_frame = tk.Frame(card, bg=COLORS["card_bg"], pady=12)
        m_frame.pack(fill="x")
        m_frame.columnconfigure(0, weight=1)
        m_frame.columnconfigure(1, weight=1)

        self.lbl_target = self._metric_box(m_frame, 0, "TARGET AMOUNT", "25,000 PKR")
        self.lbl_deadline = self._metric_box(m_frame, 1, "DEADLINE", "2026-12-31")
        self.lbl_saved = self._metric_box(m_frame, 2, "NET SAVED TO DATE", "19,000 PKR")
        self.lbl_needed = self._metric_box(m_frame, 3, "REMAINING NEEDED", "6,000 PKR")

        # Right: Define New Goal Form
        form_card = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        form_card.grid(row=0, column=1, sticky="nsew", pady=(0, 20))

        tk.Label(
            form_card,
            text="Update Savings Target",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        tk.Label(form_card, text="Milestone Name:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_name = ttk.Entry(form_card)
        self.ent_name.insert(0, "Littmann Classic III Stethoscope")
        self.ent_name.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text=f"Target Amount ({CURRENCY_SYMBOL}):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_target = ttk.Entry(form_card)
        self.ent_target.insert(0, "25000")
        self.ent_target.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Target Date (YYYY-MM-DD):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_date = ttk.Entry(form_card)
        self.ent_date.insert(0, "2026-12-31")
        self.ent_date.pack(fill="x", pady=(2, 14))

        btn_save = tk.Button(
            form_card,
            text="🎯 Set Active Milestone",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bg=COLORS["primary"],
            fg="#FFFFFF",
            bd=0,
            pady=8,
            cursor="hand2",
            command=self._save_goal
        )
        btn_save.pack(fill="x")

    def _metric_box(self, parent, index, title, val):
        r, c = index // 2, index % 2
        f = tk.Frame(parent, bg="#0E1526", padx=10, pady=8)
        f.grid(row=r, column=c, padx=4, pady=4, sticky="nsew")
        tk.Label(f, text=title, font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 7, "bold"), fg=COLORS["text_muted"], bg="#0E1526").pack(anchor="w")
        l = tk.Label(f, text=val, font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"), fg=COLORS["text_bright"], bg="#0E1526")
        l.pack(anchor="w", pady=(2, 0))
        return l

    def _save_goal(self):
        try:
            self.controller.forecast_service.set_savings_goal(
                self.ent_name.get(), self.ent_target.get(), self.ent_date.get()
            )
            messagebox.showinfo("Success", "New savings target saved!")
            self.refresh_data()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def refresh_data(self):
        res = self.controller.forecast_service.get_savings_goal_progress()
        if res:
            self.lbl_goal.config(text=res["goal_name"])
            self.bar["value"] = res["progress_percentage"]
            self.lbl_pct.config(text=f"{res['progress_percentage']}% ({res['net_saved']:,.0f} / {res['target_amount']:,.0f} PKR)")
            self.lbl_target.config(text=f"{res['target_amount']:,.0f} PKR")
            self.lbl_deadline.config(text=res["target_date"])
            self.lbl_saved.config(text=f"{res['net_saved']:,.0f} PKR")
            self.lbl_needed.config(text=f"{res['remaining_needed']:,.0f} PKR")
`,"test_suite.py":`"""
Automated Test Suite for IB Computer Science SL Internal Assessment (Criterion E)
Executes all 20 Test Cases specified in Phase 5:
- Normal, Boundary, and Erroneous test types
- Validates data constraints, zero budgets, 80% boundary, burn rate formulas, and goals
"""

import unittest
import os
import sqlite3
from database.db_manager import DatabaseManager
from services.transaction_service import TransactionService
from services.budget_service import BudgetService
from services.forecast_service import ForecastService

class TestPersonalFinanceManager(unittest.TestCase):
    def setUp(self):
        # Use an isolated in-memory or temporary SQLite database for clean testing
        self.test_db_path = "test_finance.db"
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

        self.db = DatabaseManager(db_path=self.test_db_path)
        self.trans_svc = TransactionService(self.db)
        self.budget_svc = BudgetService(self.db)
        self.forecast_svc = ForecastService(self.db)

        # Cache category map
        self.cats = {c["name"]: c["category_id"] for c in self.db.get_all_categories()}

    def tearDown(self):
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

    # T1: Normal transaction recording
    def test_T1_record_normal_transaction(self):
        tid = self.trans_svc.validate_and_record_transaction(
            amount=450.0,
            trans_date="2026-10-20",
            description="Mess dinner coupon",
            category_id=self.cats["Food & Mess"]
        )
        self.assertIsNotNone(tid)
        recents = self.trans_svc.get_recent_transactions(limit=1)
        self.assertEqual(len(recents), 1)
        self.assertEqual(recents[0]["amount"], 450.0)

    # T2: Erroneous negative amount validation
    def test_T2_negative_amount_rejection(self):
        with self.assertRaises(ValueError) as ctx:
            self.trans_svc.validate_and_record_transaction(
                amount=-150.0,
                trans_date="2026-10-20",
                description="Invalid negative expense",
                category_id=self.cats["Food & Mess"]
            )
        self.assertIn("greater than 0", str(ctx.exception))

    # T3: Erroneous invalid date validation
    def test_T3_invalid_date_format(self):
        with self.assertRaises(ValueError) as ctx:
            self.trans_svc.validate_and_record_transaction(
                amount=200.0,
                trans_date="2026-13-45",
                description="Invalid date",
                category_id=self.cats["Food & Mess"]
            )
        self.assertIn("YYYY-MM-DD", str(ctx.exception))

    # T4: Custom category addition
    def test_T4_add_custom_category(self):
        cid = self.db.add_category("Clinical Equipment", "expense")
        self.assertIsNotNone(cid)
        cats = [c["name"] for c in self.db.get_all_categories(category_type="expense")]
        self.assertIn("Clinical Equipment", cats)

    # T5: Duplicate category rejection (Integrity check)
    def test_T5_duplicate_category_rejection(self):
        with self.assertRaises(ValueError) as ctx:
            self.db.add_category("Food & Mess", "expense")
        self.assertIn("already exists", str(ctx.exception))

    # T6: Normal budget setup
    def test_T6_budget_setup(self):
        self.budget_svc.set_budget(self.cats["Food & Mess"], "2026-10", 13600.0)
        statuses = self.budget_svc.get_monthly_budget_status("2026-10")
        food_status = next(s for s in statuses if s["category_name"] == "Food & Mess")
        self.assertEqual(food_status["allocated"], 13600.0)

    # T7: Boundary: Zero budget allocation
    def test_T7_zero_budget_allocation(self):
        self.budget_svc.set_budget(self.cats["Entertainment"], "2026-10", 0.0)
        statuses = self.budget_svc.get_monthly_budget_status("2026-10")
        ent_status = next(s for s in statuses if s["category_name"] == "Entertainment")
        self.assertEqual(ent_status["allocated"], 0.0)

    # T8: Normal remaining budget calculation
    def test_T8_remaining_budget_calculation(self):
        self.budget_svc.set_budget(self.cats["Transport / Fuel"], "2026-10", 5100.0)
        self.trans_svc.validate_and_record_transaction(4400.0, "2026-10-10", "Petrol", self.cats["Transport / Fuel"])
        statuses = self.budget_svc.get_monthly_budget_status("2026-10")
        t_status = next(s for s in statuses if s["category_name"] == "Transport / Fuel")
        self.assertEqual(t_status["remaining"], 700.0)
        self.assertEqual(t_status["percentage_used"], 86.3)

    # T9: Boundary: Exactly 80% alert threshold
    def test_T9_exact_80_percent_alert(self):
        self.budget_svc.set_budget(self.cats["Education & Books"], "2026-10", 10000.0)
        self.trans_svc.validate_and_record_transaction(8000.0, "2026-10-05", "Books", self.cats["Education & Books"])
        alerts = self.budget_svc.check_threshold_alerts("2026-10")
        edu_alerts = [a for a in alerts if a["category"] == "Education & Books"]
        self.assertEqual(len(edu_alerts), 1)
        self.assertEqual(edu_alerts[0]["level"], "WARNING")

    # T10: Boundary: 79.9% spent (no alert triggered)
    def test_T10_79_point_9_percent_no_alert(self):
        self.budget_svc.set_budget(self.cats["Education & Books"], "2026-10", 10000.0)
        self.trans_svc.validate_and_record_transaction(7990.0, "2026-10-05", "Books", self.cats["Education & Books"])
        alerts = self.budget_svc.check_threshold_alerts("2026-10")
        edu_alerts = [a for a in alerts if a["category"] == "Education & Books"]
        self.assertEqual(len(edu_alerts), 0)

    # T11: Boundary: Budget exceeded (DANGER alert)
    def test_T11_budget_exceeded_alert(self):
        self.budget_svc.set_budget(self.cats["Miscellaneous"], "2026-10", 1000.0)
        self.trans_svc.validate_and_record_transaction(1200.0, "2026-10-08", "Emergency repair", self.cats["Miscellaneous"])
        alerts = self.budget_svc.check_threshold_alerts("2026-10")
        misc_alerts = [a for a in alerts if a["category"] == "Miscellaneous"]
        self.assertEqual(len(misc_alerts), 1)
        self.assertEqual(misc_alerts[0]["level"], "DANGER")

    # T12: Normal month-end forecast
    def test_T12_forecast_calculation(self):
        # Record 21,000 spent by Oct 20
        self.trans_svc.validate_and_record_transaction(21000.0, "2026-10-20", "Mid-month bundle", self.cats["Food & Mess"])
        fc = self.forecast_svc.forecast_month_end("2026-10", expected_income=40000.0, as_of_date_str="2026-10-20")
        self.assertEqual(fc["daily_burn_rate"], 1050.0)
        self.assertEqual(fc["projected_expense"], 32550.0)
        self.assertEqual(fc["projected_savings"], 7450.0)

    # T13: Boundary: Forecast on Day 1 (no zero division)
    def test_T13_forecast_day_one_boundary(self):
        self.trans_svc.validate_and_record_transaction(500.0, "2026-10-01", "Day 1 snack", self.cats["Food & Mess"])
        fc = self.forecast_svc.forecast_month_end("2026-10", expected_income=40000.0, as_of_date_str="2026-10-01")
        self.assertEqual(fc["daily_burn_rate"], 500.0)
        self.assertEqual(fc["projected_expense"], 15500.0)
        self.assertEqual(fc["projected_savings"], 24500.0)

    # T14: Search filtering by keyword
    def test_T14_search_by_keyword(self):
        self.trans_svc.validate_and_record_transaction(500.0, "2026-10-10", "Hostel Mess tea", self.cats["Food & Mess"])
        self.trans_svc.validate_and_record_transaction(800.0, "2026-10-12", "Bike fuel", self.cats["Transport / Fuel"])
        results = self.trans_svc.search_transactions(keyword="Mess")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["description"], "Hostel Mess tea")

    # T15: Search with no match
    def test_T15_search_no_match(self):
        self.trans_svc.validate_and_record_transaction(500.0, "2026-10-10", "Hostel tea", self.cats["Food & Mess"])
        results = self.trans_svc.search_transactions(keyword="UnicornStethoscope")
        self.assertEqual(len(results), 0)

    # T16: Normal budget suggestion logic (Criterion 11)
    def test_T16_suggest_limits_distribution(self):
        res = self.budget_svc.suggest_budget_distribution(monthly_income=40000.0, target_monthly_savings=6000.0)
        self.assertEqual(res["spending_pool"], 34000.0)
        allocs = res["allocations"]
        self.assertEqual(allocs["Food & Mess"], 13600.0)
        self.assertEqual(allocs["Transport / Fuel"], 5100.0)
        self.assertEqual(allocs["Education & Books"], 5100.0)
        self.assertEqual(sum(allocs.values()), 34000.0)

    # T17: Erroneous budget suggestion: savings >= income
    def test_T17_suggest_limits_excessive_savings_rejected(self):
        with self.assertRaises(ValueError) as ctx:
            self.budget_svc.suggest_budget_distribution(monthly_income=40000.0, target_monthly_savings=45000.0)
        self.assertIn("strictly less than", str(ctx.exception))

    # T18: Normal savings goal progress
    def test_T18_savings_goal_progress(self):
        self.forecast_svc.set_savings_goal("Littmann Stethoscope", 25000.0, "2026-12-31")
        # Lifetime: Income 40,000, Expense 21,000 -> Net 19,000 (76.0%)
        self.trans_svc.validate_and_record_transaction(40000.0, "2026-10-01", "Stipend", self.cats["Monthly Stipend"])
        self.trans_svc.validate_and_record_transaction(21000.0, "2026-10-20", "Expenses", self.cats["Food & Mess"])
        progress = self.forecast_svc.get_savings_goal_progress()
        self.assertEqual(progress["net_saved"], 19000.0)
        self.assertEqual(progress["remaining_needed"], 6000.0)
        self.assertEqual(progress["progress_percentage"], 76.0)
        self.assertFalse(progress["is_achieved"])

    # T19: Boundary: Negative net savings clamped to 0% progress
    def test_T19_negative_net_savings_clamping(self):
        self.forecast_svc.set_savings_goal("Emergency Fund", 20000.0, "2026-12-31")
        self.trans_svc.validate_and_record_transaction(10000.0, "2026-10-01", "Income", self.cats["Monthly Stipend"])
        self.trans_svc.validate_and_record_transaction(15000.0, "2026-10-05", "Big bill", self.cats["Food & Mess"])
        progress = self.forecast_svc.get_savings_goal_progress()
        self.assertEqual(progress["net_saved"], -5000.0)
        self.assertEqual(progress["progress_percentage"], 0.0)

    # T20: Persistence across database reconnections
    def test_T20_persistence_verification(self):
        self.trans_svc.validate_and_record_transaction(1500.0, "2026-10-15", "Lab kit", self.cats["Education & Books"])
        # Re-instantiate database manager with the same file
        new_db = DatabaseManager(db_path=self.test_db_path)
        new_trans_svc = TransactionService(new_db)
        recents = new_trans_svc.get_recent_transactions(limit=5)
        self.assertTrue(any(r["description"] == "Lab kit" for r in recents))

if __name__ == "__main__":
    unittest.main()
`};async function a(){let e=new r.default;Object.entries(i).forEach(([t,n])=>{e.file(t,n)});let t=!1;try{let n=await fetch(`/offline_dist/index.html`);if(n.ok){let r=await n.text();r=r.replace(/\/assets\//g,`./assets/`).replace(/\/icon\.svg/g,`./icon.svg`).replace(/\/favicon\.ico/g,`./favicon.ico`).replace(/\/manifest\.webmanifest/g,`./manifest.webmanifest`),e.file(`offline_ui/index.html`,r),t=!0;let i=[...r.matchAll(/src=["'](\.?\/assets\/[^"']+)["']/g)],a=[...r.matchAll(/href=["'](\.?\/assets\/[^"']+)["']/g)],o=Array.from(new Set([...i.map(e=>e[1]),...a.map(e=>e[1])]));for(let t of o){let n=t.replace(/^\./,``),r=`/offline_dist`+n,i=`offline_ui`+n;try{let t=await fetch(r);if(t.ok){let n=await t.text();e.file(i,n)}}catch(e){console.warn(`Failed to fetch asset `+r,e)}}for(let t of[{url:`/offline_dist/icon.svg`,path:`offline_ui/icon.svg`,isBinary:!1},{url:`/offline_dist/manifest.webmanifest`,path:`offline_ui/manifest.webmanifest`,isBinary:!1},{url:`/offline_dist/favicon.ico`,path:`offline_ui/favicon.ico`,isBinary:!0}])try{let n=await fetch(t.url);n.ok&&(t.isBinary?e.file(t.path,await n.arrayBuffer()):e.file(t.path,await n.text()))}catch{}}}catch(e){console.warn(`Asset bundle fetching encountered error:`,e)}t||e.file(`offline_ui/index.html`,`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Personal Finance Manager (Hostel Edition) - Offline</title>
  <style>
    body { margin: 0; background: #0B0F19; color: #F1F5F9; font-family: system-ui, -apple-system, sans-serif; display: flex; height: 100vh; overflow: hidden; }
    aside { width: 240px; background: #070A12; border-right: 1px solid #1E293B; padding: 20px 16px; display: flex; flex-direction: column; justify-content: space-between; }
    main { flex: 1; padding: 30px; overflow-y: auto; }
    .card { background: #131B2E; border: 1px solid #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .badge { background: #0284C7; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
    .kpi { background: #131B2E; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; }
    .kpi-title { font-size: 11px; color: #94A3B8; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; }
    .kpi-val { font-size: 22px; font-weight: bold; color: #F8FAFC; }
    button { background: #0284C7; color: white; border: none; border-radius: 8px; padding: 10px 18px; font-weight: 600; cursor: pointer; }
    button:hover { background: #0369A1; }
  </style>
</head>
<body>
  <aside>
    <div>
      <h2 style="margin:0;font-size:15px;color:#38BDF8;font-weight:bold;">FINANCE MANAGER</h2>
      <p style="font-size:11px;color:#94A3B8;margin-top:4px;">Hostel Medical Student Edition</p>
      <div style="margin-top:20px;"><span class="badge">100% OFFLINE</span></div>
    </div>
    <div style="font-size:11px;color:#64748B;">IB DP Computer Science SL</div>
  </aside>
  <main>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <h1 style="margin:0;font-size:22px;">Monthly Dashboard • 40,000 PKR Stipend</h1>
        <p style="margin:4px 0 0;color:#94A3B8;font-size:13px;">Real-time local expense tracking & savings forecast</p>
      </div>
      <button onclick="location.reload()">↻ Refresh</button>
    </div>
    <div class="grid">
      <div class="kpi"><div class="kpi-title">Monthly Stipend</div><div class="kpi-val" style="color:#38BDF8;">40,000 PKR</div></div>
      <div class="kpi"><div class="kpi-title">Total Spent</div><div class="kpi-val">21,000 PKR</div></div>
      <div class="kpi"><div class="kpi-title">Remaining Budget</div><div class="kpi-val" style="color:#2DD4BF;">13,000 PKR</div></div>
      <div class="kpi"><div class="kpi-title">Predicted Savings</div><div class="kpi-val" style="color:#34D399;">7,500 PKR</div></div>
    </div>
    <div class="card">
      <h3 style="margin-top:0;">Category Allocations (Food: 16k, Fuel: 6k, Education: 4k, Care: 4k, Misc: 4k)</h3>
      <p style="color:#94A3B8;font-size:13px;">To use the full React/Tailwind frontend or Python Tkinter, launch with <code>run_windows.bat</code> or <code>run_mac_linux.sh</code>!</p>
    </div>
  </main>
</body>
</html>`);let n=await e.generateAsync({type:`blob`}),a=URL.createObjectURL(n),o=document.createElement(`a`);o.href=a,o.download=`Personal_Finance_Manager_Offline.zip`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a)}export{a as downloadOfflineDesktopPackage};