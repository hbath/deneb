export {
    cleanParse,
    getBaseValidator,
    getJsonAsIndentedString,
    getSchemaValidator
};

import Ajv from 'ajv';
import * as draft06 from 'ajv/lib/refs/json-schema-draft-06.json';
import stringify from 'json-stringify-pretty-compact';

import { getConfig } from '../../core/utils/config';
import { isFeatureEnabled } from './features';

type TIndentContext = 'editor' | 'tooltip';

/**
 * Intended to be used as a substitute for `JSON.parse`; will ensure that any supplied `content` is sanitised for URLs
 * (if blocking them) prior to a regular parse. The optional `fallback` allows the caller to provide a default to provide
 * if the parse fails (will return empty object (`{}`) if not supplied).
 */
const cleanParse = (content: string, fallback?: string) => {
    try {
        return JSON.parse(content);
    } catch {
        return JSON.parse(fallback || '{}');
    }
};

/**
 * Get a new instance of `Ajv`, with the necessary base configuration for validating a Vega or Vega-Lite specification.
 */
const getBaseValidator = () =>
    new Ajv({}).addFormat('color-hex', () => true).addMetaSchema(draft06);

const getJsonAsIndentedString = (
    json: object,
    context: TIndentContext = 'editor'
) =>
    stringify(json, {
        maxLength: getConfig().propertyDefaults.editor.maxLineLength,
        indent:
            (context === 'editor' &&
                getConfig().propertyDefaults.editor.tabSize) ||
            '\u2800'
    });

/**
 * Apply the supplied JSON schema to a `getBaseValidator` and attempt to compile it.
 */
const getSchemaValidator = (schema: Object) =>
    getBaseValidator().compile(schema);