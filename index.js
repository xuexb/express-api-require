/**
 * @file 本地运行API接口
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

const url = require('url');
const fs = require('fs');
const path = require('path');

/**
 * 默认配置
 *
 * @const
 * @type {Object}
 * @param {string} root 根目录
 * @param {Function} filter 过滤器
 * @param {Object} extMap 请求接口扩展名映射
 */
const DEFAULTS = {
    root: process.cwd(),
    filter(req) {
        return true;
    },
    extMap: {
        json: 'js'
    }
};

module.exports = options => {
    options = Object.assign({}, DEFAULTS, options);
    return (req, res, next) => {
        if (!options.filter(req)) {
            return next();
        }

        const filepath = path.resolve(options.root, url.parse(req.url).pathname.substr(1));
        const extname = path.extname(filepath);
        const mockext = options.extMap[extname.substr(1)];
        const mockpath = path.resolve(path.dirname(filepath), `${path.basename(filepath, extname)}.${mockext}`);

        if (fs.existsSync(filepath) || !mockext || !fs.existsSync(mockpath)) {
            return next();
        }

        try {
            delete require.cache[mockpath];
            const app = require(mockpath);

            res.setHeader('content-type', 'application/json');

            if (typeof app === 'function') {
                app(req, res, next);
            }
            else {
                res.end(JSON.stringify(app));
            }
        }
        catch (e) {
            console.error(e);
            next();
        }
    };
};
