import * as chai from 'chai';
import chaiImmutable from 'chai-immutable';
import * as jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

(global as any).document = doc;
(global as any).window = win;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);