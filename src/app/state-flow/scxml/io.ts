/* eslint-disable @typescript-eslint/naming-convention */
import { PathResolver } from './api';
import { Scxml, CustomAction, ParsedValue, TextValue, NodeValue, JsonValue } from './model/model';
import * as fxml from 'fast-xml-parser';

export class ScxmlReader {

    private static SCXML_REQUIRED_VERSION = '1.0';

    private static XMLNS_DEFAULT = null;

    private static ERR_NULL_URL = 'Cannot parse null URL';

    private static ERR_NULL_PATH = 'Cannot parse null path';

    private static ERR_NULL_ISTR = 'Cannot parse null InputStream';

    private static ERR_NULL_READ = 'Cannot parse null Reader';

    private static ERR_NULL_SRC = 'Cannot parse null Source';

    private static ERR_CUSTOM_ACTION_TYPE = 'Custom actions list'
        + ' contained unknown object, class not a Commons SCXML Action class subtype: ';

    private static ERR_PARSER_CFG = 'ParserConfigurationException while trying'
        + ' to parse stream into DOM node(s).';

    private static ERR_STATE_SRC =
        'Source attribute in <state src="{0}"> cannot be parsed';

    private static ERR_STATE_SRC_FRAGMENT = 'URI Fragment in '
        + '<state src="{0}"> is an unknown state in referenced document';

    private static ERR_STATE_SRC_FRAGMENT_TARGET = 'URI Fragment'
        + ' in <state src="{0}"> does not point to a <state> or <final>';

    private static ERR_REQUIRED_ATTRIBUTE_MISSING = '<{0}> is missing'
        + ' required attribute "{1}" value at {2}';

    private static ERR_ATTRIBUTE_NOT_BOOLEAN = 'Illegal value "{0}"'
        + 'for attribute "{1}" in element <{2}> at {3}.'
        + ' Only the value "true" or "false" is allowed.';

    private static ERR_RESERVED_ID_PREFIX = 'Reserved id prefix "'
        + Scxml.GENERATED_TT_ID_PREFIX + '" used for <{0} id="{1}"> at {2}';

    private static ERR_UNSUPPORTED_TRANSITION_TYPE = 'Unsupported transition type '
        + 'for <transition type="{0}"> at {1}.';

    private static ERR_INVALID_VERSION = 'The <scxml> element defines'
        + ' an unsupported version "{0}", only version "1.0" is supported.';

    public XMLInputFactory_JDK_PROP_REPORT_CDATA = 'http://java.sun.com/xml/stream/properties/report-cdata-event';


    // public static read(scxmlPath: string): Scxml {
    //     var configuration = null;
    //     return this.read(scxmlPath, configuration);
    // }

    public static read(scxmlPath: string, configuration: Configuration = null): Scxml {

        console.log('ładuję dane!');

        if (fxml.validate(scxmlPath) === true) {

        }

        return null;
    }

    private static readDocument(reader, configuration: Configuration): Scxml {

        const scxml = new Scxml();
        scxml.setPathResolver(configuration.pathResolver);

        return scxml;
    }

    private static readSCXML(reader, configuration: Configuration, scxml: Scxml) {

    }
}

export class ContentParser {

    public static DEFAULT_PARSER: ContentParser = new ContentParser();

    private jsonObjectMapper;


    public static trimContent(content: string): string {
        if (content != null) {
            let start = 0;
            let length = content.length;
            while (start < length && this.isWhiteSpace(content.charAt(start))) {
                start++;
            }
            while (length > start && this.isWhiteSpace(content.charAt(length - 1))) {
                length--;
            }
            if (start === length) {
                return '';
            }
            return content.substring(start, length);
        }
        return null;
    }

    public static spaceNormalizeContent(content: string): string {
        if (content != null) {
            let index = 0;
            const length = content.length;
            let buffer = '';
            let whiteSpace = false;
            while (index < length) {
                if (this.isWhiteSpace(content.charAt(index))) {
                    if (!whiteSpace && buffer.length > 0) {
                        buffer += ' ';
                        whiteSpace = true;
                    }
                }
                else {
                    buffer += content.charAt(index);
                    whiteSpace = false;
                }
                index++;
            }

            if (whiteSpace) {
                buffer.substring(0, buffer.length - 1);
            }
            return buffer.toString();
        }
        return null;
    }

    public static isWhiteSpace(c: string): boolean {
        return c === ' ' || c === '\n' || c === '\t' || c === '\r';
    }

    public static hasJsonSignature(content: string): boolean {
        const c = content.length > 0 ? content.charAt(0) : 0;
        return c === '{' || c === '[';
    }

    public static hasXmlSignature(content: string): boolean {
        return content != null && content.startsWith('<?xml ');
    }

    public parseJson(jsonString: string): any {
        return null;
    }

    public toJson(jsonObject: any) {
        return null;
    }

    public parseXml(xmlString: string) {
        return null;
    }

    public toXml(node): string {
        return null;
    }

    public parseContent(content: string): ParsedValue {
        if (content != null) {
            const src = ContentParser.trimContent(content);
            if (ContentParser.hasJsonSignature(src)) {
                return new JsonValue(this.parseJson(src), false);
            }
            if (ContentParser.hasXmlSignature(src)) {
                return new NodeValue(this.parseXml(src));
            }
            return new TextValue(ContentParser.spaceNormalizeContent(src), false);
        }
        return null;
    }

    public parseResource(resourceURL: string): ParsedValue {
        return null;
    }
}


export class Configuration {

    factoryId: string;

    factoryClassLoader;

    allocator;

    properties: Map<string, any>;

    resolver;

    reporter;

    encoding: string;

    systemId: string;

    validate: boolean;

    customActions: CustomAction[];

    customActionClassLoader;

    useContextClassLoaderForCustomActions: boolean;

    parent: Scxml;

    pathResolver: PathResolver;

    silent: boolean;

    strict: boolean;

    contentParser: ContentParser;

    constructor(factoryId: string, factoryClassLoader, allocator,
        properties: Map<string, any>, resolver, reporter,
        encoding: string, systemId: string, validate: boolean, pathResolver: PathResolver,
        parent: Scxml, customActions: CustomAction[], customActionClassLoader,
        useContextClassLoaderForCustomActions: boolean, silent: boolean, strict: boolean) {
        this.factoryId = factoryId;
        this.factoryClassLoader = factoryClassLoader;
        this.allocator = allocator;
        this.properties = (properties == null ? new Map() : properties);
        this.resolver = resolver;
        this.reporter = reporter;
        this.encoding = encoding;
        this.systemId = systemId;
        this.validate = validate;
        this.pathResolver = pathResolver;
        this.parent = parent;
        this.customActions = (customActions == null ? new Array() : customActions);
        this.customActionClassLoader = customActionClassLoader;
        this.useContextClassLoaderForCustomActions = useContextClassLoaderForCustomActions;
        this.silent = silent;
        this.strict = strict;
        this.contentParser = new ContentParser();
    }

    public isSilent(): boolean {
        return this.silent;
    }

    public setSilent(silent: boolean) {
        this.silent = silent;
    }

    public isStrict(): boolean {
        return this.strict;
    }

    public setStrict(strict: boolean) {
        this.strict = strict;
    }
}


