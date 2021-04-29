

export class Scxml {
    
    
    
    
}

export class ActionExecutionContext {
    
    
}

export enum ParsedValueType {
  TEXT, JSON, NODE, NODE_LIST, NODE_TEXT  
}

export enum TransitionType {
  internal, external  
}

export class ModelException extends Error {
    
}    

export interface Observable {
    
    getObservableId(): number;
}

export interface ParsedValue {
    
    getType(): ParsedValueType;

    getValue(): any;
}

export interface ParsedValueContainer {

    getParsedValue(): ParsedValue;

    setParsedValue(parsedValue: ParsedValue);
}

export interface ContentContainer {

    getContent(): Content;

    setContent(content: Content);
}

export interface ParamsContainer {

    getParams(): Param[];
}

export class TransitionTarget {

    private id: string;

    private parent: EnterableState;
    
    private ancestors: EnterableState[] = [];
    
    public getId(): string {
        return this.id;
    }
    
    public setId(id: string) {
        this.id = id;
    }
    
    public getNumberOfAncestors():number {
        return this.ancestors.length;
    }
    
    public getAncestor(level: number): EnterableState {
        return this.ancestors[level];
    }
    
    public getParent(): EnterableState {
        return this.parent;
    }
    
    public setParent(parent: EnterableState) {
        if (!parent) {
            throw new Error("Parent parameter cannot be null");
        }
        if (this.id === parent.id) {
            throw new Error("Cannot set self as parent");
        }
        if (this.parent != parent) {
            this.parent = parent;
            this.updateDescendantsAncestors();
        }
    }
    
    updateDescendantsAncestors() {
        this.ancestors = this.parent.ancestors.slice();
        this.ancestors.push(this.parent);
    }
    
    public isDescendantOf(context: TransitionTarget): boolean {
        return this.getNumberOfAncestors() > context.getNumberOfAncestors()
                && this.getAncestor(context.getNumberOfAncestors()) == context;
    }
}

export class EnterableState extends TransitionTarget implements Observable {

    private order: number = 0;
    
    private onEntries: OnEntry[] = [];

    private onExits: OnExit[] = [];

    private observableId: number;

    public getOrder(): number {
        return this.order;
    }
    
    public setOrder(order: number) {
        this.order = order;
    }

    public getOnEntries(): OnEntry[]{
        return this.onEntries;
    }
    
    public addOnEntry(onEntry: OnEntry) {
        onEntry.setParent(this);
        this.onEntries.push(onEntry);
    }

    public getOnExits(): OnExit[]{
        return this.onExits;
    }
    
    public addOnExit(onExits: OnExit) {
        onExits.setParent(this);
        this.onExits.push(onExits);
    }
    
    public getObservableId(): number {
        return this.observableId;
    }
    
    public setObservableId(observableId: number) {
        this.observableId = observableId;
    }
}

export class TransitionalState extends EnterableState {

    private transitions: Transition[] = [];
    
    private datamodel: DataModel;

    private history: History[] = [];

    private invokes: Invoke[] = [];

    private children: EnterableState[] = [];

    updateDescendantsAncestors() {
        super.updateDescendantsAncestors();
        for (var h of this.history) {
            // reset ancestors
            h.updateDescendantsAncestors();
        }
        for (var child of this.children) {
            child.updateDescendantsAncestors();
        }
    }
    
    public getParent(): TransitionalState {
        return super.getParent() as TransitionalState;
    }
    
    public setParent(parent: TransitionalState) {
        super.setParent(parent);
    }
    
    public getAncestor(level: number): TransitionalState {
        return super.getAncestor(level) as TransitionalState;
    }
    
    public getTransitionsListByEvent(event: string): Transition[] {
        var matchingTransitions: Transition[] = null; // since we returned null upto v0.6
        for (var t of this.transitions) {
            if ((event == null && t.getEvent() == null)
                    || (event != null && event === t.getEvent())) {
                if (matchingTransitions == null) {
                    matchingTransitions = new Array();
                }
                matchingTransitions.push(t);
            }
        }
        return matchingTransitions;
    }
    
    public faddTransition(transition: Transition) {
        this.transitions.push(transition);
        transition.setParent(this);
    }
    
    public getTransitionsList(): Transition[] {
        return this.transitions;
    }
    
    public getDatamodel(): DataModel {
        return this.datamodel;
    }
    
    public setDatamodel(datamodel: DataModel) {
        this.datamodel = datamodel;
    }
    
    public getHistory(): History[] {
        return this.history;
    }
    
    public addHistory(history: History) {
        if (history) {
            this.history.push(history);
        }
    }
    
    public hasHistory():boolean {
        return this.history.length > 0;
    }

    public getInvokes(): Invoke[] {
        return this.invokes;
    }

    public addInvoke(invoke: Invoke) {
        invoke.setParentEnterableState(this, this.invokes.length);
        this.invokes.push(invoke);
    }
   
    public getChildren(): EnterableState[] {
        return this.children;
    }

    protected addChild(es: EnterableState) {
        this.children.push(es);
        es.setParent(this);
    }
}

export class Executable {
    
    private actions: Action[] = [];
    
    private parent: EnterableState;
    
    public getActions(): Action[] {
        return this.actions;
    }
    
    public addAction(action: Action) {
        if (action) {
            this.actions.push(action);
        }
    }
    
    public getParent(): EnterableState {
        return this.parent;
    }
    
    public setParent(parent: EnterableState) {
        this.parent = parent;
    }
}

class OnEntry extends Executable {

    private raiseEvent: boolean;

    public isRaiseEvent(): boolean {
        return this.raiseEvent;
    }
    
    public setRaiseEvent(raiseEvent: boolean) {
        this.raiseEvent = raiseEvent;
    }
}

class OnExit extends Executable {

    private raiseEvent: boolean;

    public isRaiseEvent(): boolean {
        return this.raiseEvent;
    }
    
    public setRaiseEvent(raiseEvent: boolean) {
        this.raiseEvent = raiseEvent;
    }
}

class SimpleTransition extends Executable implements Observable {

    private type: TransitionType;
    
    private transitionDomain: TransitionalState;
    
    private scxmlTransitionDomain: boolean;
    
    private typeInternal: boolean;

    private targets: TransitionTarget[] = [];

    private next: string;

    private observableId: number;

    private isCompoundStateParent(ts: TransitionalState): boolean {
        return ts != null && ts instanceof State && ts.isComposite();
    }

    public isTypeInternal(): boolean {
        if (this.typeInternal == null) {

            // derive typeInternal
            this.typeInternal = TransitionType.internal == this.type && this.isCompoundStateParent(this.getParent() as TransitionalState);

            if (this.typeInternal && this.targets.length > 0) {
                for (var tt of this.targets) {
                    if (!tt.isDescendantOf(this.getParent())) {
                        this.typeInternal = false;
                        break;
                    }
                }
            }
        }
        return this.typeInternal;
    }
    
    public getTransitionDomain(): TransitionalState {
        var ts = this.transitionDomain;
        if (ts == null && this.targets.length > 0 && !this.scxmlTransitionDomain) {

            if (this.getParent() != null && this.getParent() instanceof TransitionalState) {
                if (this.isTypeInternal()) {
                    this.transitionDomain = <TransitionalState>this.getParent();
                }
                else {
                    // findLCCA
                    for (let i = this.getParent().getNumberOfAncestors()-1; i > -1; i--) {
                        if (this.isCompoundStateParent(this.getParent().getAncestor(i) as TransitionalState)) {
                            var allDescendants = true;
                            for (var tt of this.targets) {
                                if (i >= tt.getNumberOfAncestors()) {
                                    i = tt.getNumberOfAncestors();
                                    allDescendants = false;
                                    break;
                                }
                                if (tt.getAncestor(i) != this.getParent().getAncestor(i)) {
                                    allDescendants = false;
                                    break;
                                }
                            }
                            if (allDescendants) {
                                this.transitionDomain = this.getParent().getAncestor(i) as TransitionalState;
                                break;
                            }
                        }
                    }
                }
            }
            ts = this.transitionDomain;
            if (ts == null) {
                this.scxmlTransitionDomain = true;
            }
        }
        return ts;
    }    
    
    public getType(): TransitionType {
        return this.type;
    }
    
    public setType(type: TransitionType) {
        this.type = type;
    }
    
    public getNext(): string {
        return this.next;
    }
    
    public setNext(next: string) {
        this.next = next;
    }
    
    public getTargets(): TransitionTarget[] {
        return this.targets;
    }
    
    public getObservableId(): number {
        return this.observableId;
    }
    
    public setObservableId(observableId: number) {
        this.observableId = observableId;
    }
}

export class Transition extends SimpleTransition {

    private event: string;
    
    private events: string[] = [];

    private noEvents: boolean;

    private allEvents: boolean;

    private cond: string;

    private order: number = 0;
    
    public getEvent(): string {
        return this.event;
    }
    
    public setEvent(event: string) {
        this.event = event == null ? null : event.trim();
        if (this.event != null) {
            // 'event' is a space separated list of event descriptors
            this.events = new Array();
            var st = this.event.split(" ", 3); 
            for (var token of st) {
                if (token == "*" || token == ".*") {
                    this.events = new Array();
                    this.events.push("*");
                    break;
                }
                else {
                    if (token.endsWith("*")) {
                        token = token.substring(0, token.length-1);
                    }
                    if (token.endsWith(".")) {
                        token = token.substring(0, token.length-1);
                    }
                    if (token.length > 0) {
                        this.events.push(token);
                    }
                }
            }
        }
        else {
            this.events = new Array();
        }
        this.noEvents = this.events.length <= 0;
        this.allEvents = !this.noEvents && this.events[0] === "*";
    }
    
    public getEvents(): string[] {
        return this.events;
    }

    public getCond(): string {
        return this.cond;
    }
    
    public setCond(cond: string) {
        this.cond = cond;
    }

    public getOrder(): number {
        return this.order;
    }
    
    public setOrder(order: number) {
        this.order = order;
    }

    public isNoEventsTransition(): boolean {
        return this.noEvents;
    }

    public isAllEventsTransition(): boolean {
        return this.allEvents;
    }    
}

export class State extends TransitionalState {
    
    private first: string;

    private initial: Initial;

    public getInitial(): Initial {
        return this.initial;
    }

    public setInitial(target: Initial) {
        this.first = null;
        this.initial = target;
        target.setParent(this);
    }

    public getFirst(): string {
        return this.first;
    }

    public setFirst(target: string) {
        this.first = target;
        var t = new SimpleTransition();
        t.setNext(target);
        var ini = new Initial();
        ini.setGenerated();
        ini.setTransition(t);
        ini.setParent(this);
        this.initial = ini;
    }

    public isAtomicState(): boolean {
        return this.getChildren().length <= 0;
    }

    public isSimple(): boolean {
        return this.isAtomicState();
    }

    public isComposite(): boolean {
        return !this.isSimple();
    }

    public isRegion(): boolean {
        return this.getParent() instanceof Parallel;
    }

    public addChild(es: EnterableState) {
        super.addChild(es);
    }
}

export class Parallel extends TransitionalState {
    
    public isAtomicState(): boolean {
        return false;
    }

    public addChild(ts: TransitionalState) {
        super.addChild(ts);
    }
}

export class History extends TransitionTarget {
    
    private deep: boolean;

    private transition: SimpleTransition;

    public getTransition(): SimpleTransition {
        return this.transition;
    }

    public setTransition(transition: SimpleTransition) {
        if (this.getParent() == null) {
            throw new Error("history transition cannot be set before setting its parent");
        }
        this.transition = transition;
        this.transition.setParent(this.getParent());
    }

    public isDeep(): boolean {
        return this.deep;
    }

    public setType(type: string) {
        if ("deep" === type) {
            this.deep = true;
        }
        //shallow is by default
    }

    public getParent(): TransitionalState {
        return super.getParent() as TransitionalState;
    }

    public setParent(parent: TransitionalState) {
        super.setParent(parent);
    }
}

export class Initial {
    
    private parent: State;

    private transition: SimpleTransition;

    private generated: boolean;

    public getParent(): State {
        return this.parent;
    }

    public setParent(parent: State) {
        this.parent = parent;
        if (this.transition != null) {
            this.transition.setParent(parent);
        }
    }

    public getTransition(): SimpleTransition {
        return this.transition;
    }

    public setTransition(transition: SimpleTransition) {
        this.transition = transition;
        this.transition.setParent(this.getParent());
    }

    public isGenerated(): boolean {
        return this.generated;
    }

    public setGenerated() {
        this.generated = true;
    }
}

export class Param {

    private name: string;
    
    private location: string;
    
    private expr: string;
    
    public getName(): string {
        return this.name;
    }
    
    public setName(name: string) {
        this.name = name;
    }

    public getLocation(): string {
        return this.location;
    }
    
    public setLocation(location: string) {
        this.location = location;
    }
    
    public getExpr(): string {
        return this.expr;
    }
    
    public setExpr(expr: string) {
        this.expr = expr;
    }
}

export class Action {

    private parent: Executable;
    
    public getParent(): Executable {
        return this.parent;
    }
    
    public setParent(parent: Executable) {
        this.parent = parent;
    }
    
    public getParentEnterableState(): EnterableState {
        if (this.parent == null && this instanceof Script && this.isGlobalScript()) {
            // global script doesn't have a EnterableState
            return null;
        } else if (!this.parent) {
            throw new Error("Action "
                    + this.constructor.name + " instance missing required parent TransitionTarget");
        }
        return this.parent.getParent();
    }
    
    public execute(exctx:ActionExecutionContext) {}
}

export class CustomAction extends Action {

    public static ERR_NO_NAMESPACE: string =
        "Cannot define a custom SCXML action with a null or empty namespace";

    private static NAMESPACE_SCXML: string =
        "http://www.w3.org/2005/07/scxml";
        
    private static ERR_RESERVED_NAMESPACE: string =
        "Cannot define a custom SCXML action within the SCXML namespace '"
        + CustomAction.NAMESPACE_SCXML + "'";
        
    private static ERR_NO_LOCAL_NAME: string =
        "Cannot define a custom SCXML action with a null or empty local name";

    private static ERR_NOT_AN_ACTION: string =
        "Custom SCXML action does not extend Action superclass";

    private namespaceURI: string;

    private localName: string;

    public getNamespaceURI(): string {
        return this.namespaceURI;
    }
    
    public setNamespaceURI(namespaceURI: string) {
        this.namespaceURI = namespaceURI;
    }
    
    public getLocalName(): string {
        return this.localName;
    }
    
    public setLocalName(localName: string) {
        this.localName = localName;
    }
}

export class Assign extends Action implements ParsedValueContainer {
    
    private location: string;
    
    private src: string;
    
    private expr: string;

    private assignValue: ParsedValue;

    public getLocation(): string {
        return this.location;
    }
    
    public setLocation(location: string) {
        this.location = location;
    }
    
    public getSrc(): string {
        return this.src;
    }
    
    public setSrc(src: string) {
        this.src = src;
    }
    
    public getExpr(): string {
        return this.expr;
    }
    
    public setExpr(expr: string) {
        this.expr = expr;
    }
    
    public getParsedValue(): ParsedValue {
        return this.assignValue;
    }
    
    public setParsedValue(assignValue: ParsedValue) {
        this.assignValue = assignValue;
    }
    
    public execute(exctx:ActionExecutionContext) {
        var parentState: EnterableState = this.getParentEnterableState();
        
    }    
}

export class Cancel extends Action {
    
    private sentId: string;

    private sentIdExpr: string;

    public getSentId(): string {
        return this.sentId;
    }
    
    public setSendId(sentId: string) {
        this.sentId = sentId;
    }
    
    public getSentIdExpr(): string {
        return this.sentIdExpr;
    }
    
    public setSentIdExpr(sentIdExpr: string) {
        this.sentIdExpr = sentIdExpr;
    }
}

export class Script extends Action {

    private globalScript: boolean;
    
    private script: string;
    
    private src: string;

    public isGlobalScript(): boolean {
        return this.globalScript;
    }
    
    public setGlobalScript(globalScript: boolean) {
        this.globalScript = globalScript;
    }
    
    public getScript(): string {
        return this.script;
    }
    
    public setScript(script: string) {
        this.script = script;
    }
    
    public getSrc(): string {
        return this.src;
    }
    
    public setSrc(src: string) {
        this.src = src;
    }
}

export class Content extends Action implements ParsedValueContainer {
    
    private expr: string;

    private contentBody: ParsedValue;
    
    public getExpr(): string {
        return this.expr;
    }
    
    public setExpr(expr: string) {
        this.expr = expr;
    }
    
    public getParsedValue(): ParsedValue {
        return this.contentBody;
    }
    
    public setParsedValue(contentBody: ParsedValue) {
        this.contentBody = contentBody;
    }
}

export class Data implements ParsedValueContainer {
    
    private id: string;

    private src: string;

    private expr: string;

    private dataValue: ParsedValue;
    
    public getId(): string {
        return this.id;
    }
    
    public setId(id: string) {
        this.id = id;
    }
    
    public getSrc(): string {
        return this.src;
    }
    
    public setSrc(src: string) {
        this.src = src;
    }
    
    public getExpr(): string {
        return this.expr;
    }
    
    public setExpr(expr: string) {
        this.expr = expr;
    }
    
    public getParsedValue(): ParsedValue {
        return this.dataValue;
    }
    
    public setParsedValue(dataValue: ParsedValue) {
        this.dataValue = dataValue;
    }
}

export class DataModel {
    
    private data: Data[] = [];

    public getOnEntries(): Data[] {
        return this.data;
    }
    
    public addOnEntry(data: Data) {
       if (data) {
           this.data.push(data);
       }
    }
}

export class DoneData {
    
    private content: Content;

    private paramsList: Param[] = [];
    
    public getContent(): Content {
        return this.content;
    }
    
    public setContent(content: Content) {
        this.content = content;
    }

    public getParams(): Param[] {
        return this.paramsList;
    }
    
    public addOnEntry(param: Param) {
       if (param) {
           this.paramsList.push(param);
       }
    }
}

export class ElseIf extends Action {
    
    private cond: string;

    public getCond(): string {
        return this.cond;
    }
    
    public setCond(cond: string) {
        this.cond = cond;
    }
    
    public execute(exctx:ActionExecutionContext) {
        // nothing to do, the <if> container will take care of this
    }    
}

export class Else extends ElseIf {
    
}

export class If extends Action {

    private cond: string;

    private actions: Action[] = [];

    private executable: boolean = false;

    public getCond(): string {
        return this.cond;
    }
    
    public setCond(cond: string) {
        this.cond = cond;
    }
    
    public getActions(): Action[] {
        return this.actions;
    }
    
    public addAction(action: Action) {
        if (action) {
            this.actions.push(action);
        }
    }
    
    public execute(exctx:ActionExecutionContext) {

    }    
}

export class Log extends Action {

    private label: string;

    private expr: string;

    private dataValue: ParsedValue;
    
    public getLabel(): string {
        return this.label;
    }
    
    public setLabel(label: string) {
        this.label = label;
    }
    
    public getExpr(): string {
        return this.expr;
    }
    
    public setExpr(expr: string) {
        this.expr = expr;
    }
    
    public execute(exctx:ActionExecutionContext) {

    }    
}

export class TextValue implements ParsedValue {

    private text: string;

    private cdata: boolean;

    constructor(text: string, cdata: boolean) {
        this.text = text;
        this.cdata = cdata;
    }    

    public isCDATA(): boolean {
        return this.cdata;
    }
    
    public setCDATA(cdata: boolean) {
        this.cdata = cdata;
    }

    public getValue(): string {
        return this.text;
    }
    
    public getType(): ParsedValueType {
        return ParsedValueType.TEXT;
    }
}

export class JsonValue implements ParsedValue {

    private jsonObject: Object;

    private cdata: boolean;

    constructor(jsonObject: Object, cdata: boolean) {
        this.jsonObject = jsonObject;
        this.cdata = cdata;
    }    

    public isCDATA(): boolean {
        return this.cdata;
    }
    
    public setCDATA(cdata: boolean) {
        this.cdata = cdata;
    }

    public getValue(): Object {
        return this.jsonObject;
    }
    
    public getType(): ParsedValueType {
        return ParsedValueType.JSON;
    }
}

export class NodeListValue implements ParsedValue {

    private nodeList: Object;

    constructor(nodeList: Object) {
        this.nodeList = nodeList;
    }    

    public getValue(): Object {
        return this.nodeList;
    }
    
    public getType(): ParsedValueType {
        return ParsedValueType.NODE_LIST;
    }
}

export class NodeTextValue implements ParsedValue {

    private nodeText: string;

    constructor(nodeText: string) {
        this.nodeText = nodeText;
    }    

    public getValue(): string {
        return this.nodeText;
    }
    
    public getType(): ParsedValueType {
        return ParsedValueType.NODE_TEXT;
    }
}

export class NodeValue implements ParsedValue {

    private node: Object;

    constructor(node: Object) {
        this.node = node;
    }    

    public getValue(): Object {
        return this.node;
    }
    
    public getType(): ParsedValueType {
        return ParsedValueType.NODE;
    }
}

export class Finalize extends Executable {

    public getParent(): TransitionalState {
        return super.getParent() as TransitionalState;
    }

    public setParent(parent: TransitionalState) {
        super.setParent(parent);
    }    
}


export class Invoke extends Action implements ContentContainer, ParamsContainer {
    
    private static CURRENT_EXECUTION_CONTEXT_KEY = "_CURRENT_EXECUTION_CONTEXT";

    private id: string;

    private idlocation: string;

    private type: string;

    private typeexpr: string;

    private src: string;

    private srcexpr: string;

    private autoForward: boolean;

    private finalize: Finalize;

    private content: Content;

    private parentEnterableState: EnterableState;

    private invokeIndex: number;

    private paramsList: Param[] = new Array();

    private namelist: string;

    public getId(): string {
        return this.id;
    }

    public setId(id: string) {
        this.id = id;
    }

    public getIdlocation(): string {
        return this.idlocation;
    }

    public setIdlocation(idlocation: string) {
        this.idlocation = idlocation;
    }

    public getType(): string {
        return this.type;
    }

    public setType(type: string) {
        this.type = type;
    }

    public getTypeexpr(): string {
        return this.typeexpr;
    }

    public setTypeexpr(typeexpr: string) {
        this.typeexpr = typeexpr;
    }

    public getSrc(): string {
        return this.src;
    }

    public setSrc(src: string) {
        this.src = src;
    }

    public getSrcexpr(): string {
        return this.srcexpr;
    }

    public setSrcexpr(srcexpr: string) {
        this.srcexpr = srcexpr;
    }

    public isAutoForward(): boolean {
        return this.autoForward != null && this.autoForward;
    }

    public getAutoForward(): boolean {
        return this.autoForward;
    }

    public setAutoForward(autoForward: boolean) {
        this.autoForward = autoForward;
    }

    public getFinalize(): Finalize {
        return this.finalize;
    }

    public setFinalize(finalize: Finalize) {
        this.finalize = finalize;
    }

    public getParams(): Param[] {
        return this.paramsList;
    }

    public getNamelist(): string {
        return this.namelist;
    }

    public setNamelist(namelist: string) {
        this.namelist = namelist;
    }

    public getContent(): Content {
        return this.content;
    }

    public getCurrentSCXMLExecutionContextKey(): string {
        return Invoke.CURRENT_EXECUTION_CONTEXT_KEY;
    }

    public setContent(content: Content) {
        this.content = content;
    }

    public getParentEnterableState(): EnterableState {
        return this.parentEnterableState;
    }

    public setParentEnterableState(parent: EnterableState, invokeIndex: number) {
        if (parent == null) {
            throw new Error("Parent parameter cannot be null");
        }
        this.parentEnterableState = parent;
        this.invokeIndex = invokeIndex;
    }

    public execute(axctx: ActionExecutionContext) {
        var parentState = this.getParentEnterableState();
    }
}

