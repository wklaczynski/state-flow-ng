/* eslint-disable @typescript-eslint/naming-convention */

export class ScxmlConstants {

    public static XMLNS_SCXML = 'http://www.w3.org/2005/07/scxml';

    public static XMLNS_COMMONS_SCXML = 'http://commons.apache.org/scxml';

    public static XMLNS_COMMONS_SCXML_PREFIX = 'cs';

    public static ELEM_ASSIGN = 'assign';

    public static ELEM_CANCEL = 'cancel';

    public static ELEM_CONTENT = 'content';

    public static ELEM_DATA = 'data';

    public static ELEM_DATAMODEL = 'datamodel';

    public static ELEM_DONEDATA = 'donedata';

    public static ELEM_ELSE = 'else';

    public static ELEM_ELSEIF = 'elseif';

    public static ELEM_FINAL = 'final';

    public static ELEM_FINALIZE = 'finalize';

    public static ELEM_HISTORY = 'history';

    public static ELEM_IF = 'if';

    public static ELEM_INITIAL = 'initial';

    public static ELEM_INVOKE = 'invoke';

    public static ELEM_FOREACH = 'foreach';

    public static ELEM_LOG = 'log';

    public static ELEM_ONENTRY = 'onentry';

    public static ELEM_ONEXIT = 'onexit';

    public static ELEM_PARALLEL = 'parallel';

    public static ELEM_PARAM = 'param';

    public static ELEM_RAISE = 'raise';

    public static ELEM_SCRIPT = 'script';

    public static ELEM_SCXML = 'scxml';

    public static ELEM_SEND = 'send';

    public static ELEM_STATE = 'state';

    public static ELEM_TRANSITION = 'transition';

    public static ELEM_VAR = 'var';

    public static ATTR_ARRAY = 'array';

    public static ATTR_AUTOFORWARD = 'autoforward';

    public static ATTR_BINDING = 'binding';

    public static ATTR_BINDING_EARLY = 'early';

    public static ATTR_BINDING_LATE = 'late';

    public static ATTR_COND = 'cond';

    public static ATTR_DATAMODEL = 'datamodel';

    public static ATTR_DELAY = 'delay';

    public static ATTR_DELAYEXPR = 'delayexpr';

    public static ATTR_EVENT = 'event';

    public static ATTR_EVENTEXPR = 'eventexpr';

    public static ATTR_EXPR = 'expr';

    public static ATTR_ID = 'id';

    public static ATTR_IDLOCATION = 'idlocation';

    public static ATTR_INDEX = 'index';

    public static ATTR_INITIAL = 'initial';

    public static ATTR_ITEM = 'item';

    public static ATTR_LABEL = 'label';

    public static ATTR_LOCATION = 'location';

    public static ATTR_NAME = 'name';

    public static ATTR_NAMELIST = 'namelist';

    public static ATTR_PROFILE = 'profile';

    public static ATTR_SENDID = 'sendid';

    public static ATTR_SENDIDEXPR = 'sendidexpr';

    public static ATTR_SRC = 'src';

    public static ATTR_SRCEXPR = 'srcexpr';

    public static ATTR_TARGET = 'target';

    public static ATTR_TARGETEXPR = 'targetexpr';

    public static ATTR_TYPE = 'type';

    public static ATTR_TYPEEXPR = 'typeexpr';

    public static ATTR_VERSION = 'version';

    public static ATTR_EXMODE = 'exmode';

    public static ATTR_HINTS = 'hints';

    public static STATE_MACHINE_HINT = 'scxml.STATE_MACHINE_HINT';
}

export interface PathResolver {

    resolvePath(ctxPath: string): string;

    getResource(ctxPath): string;

    getResolver(ctxPath: string): PathResolver;

}
