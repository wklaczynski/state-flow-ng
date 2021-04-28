

export class Scxml {
    
    
    
    
}

export class ActionExecutionContext {
    
    
}

export enum ParsedValueType {
  TEXT, JSON, NODE, NODE_LIST, NODE_TEXT  
}

export interface ParsedValue {
    
    getType(): ParsedValueType;

    getValue(): any;
}

export interface ParsedValueContainer {

    getParsedValue(): ParsedValue;

    setParsedValue(parsedValue: ParsedValue);
}

export class TransitionTarget {

    private id: string;

    private parent: EnterableState;
    
    private ancestors: EnterableState[];
    
    getId(): string {
        return this.id;
    }
    
    setId(id: string) {
        this.id = id;
    }
    
    getNumberOfAncestors():number {
        return this.ancestors.length;
    }
    
    public getAncestor(level: number): EnterableState {
        return this.ancestors[level];
    }
    
    getParent(): EnterableState {
        return this.parent;
    }
    
    setParent(parent: EnterableState) {
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
    
    private updateDescendantsAncestors() {
        this.ancestors = this.parent.ancestors.slice();
        this.ancestors.push(this.parent);
    }
    
    isDescendantOf(context: TransitionTarget): boolean {
        return this.getNumberOfAncestors() > context.getNumberOfAncestors()
                && this.getAncestor(context.getNumberOfAncestors()) == context;
    }
}

export class EnterableState extends TransitionTarget {

    private order: number = 0;
    
    private onEntries: OnEntry[];

    private onExits: OnExit[];

    getOrder(): number {
        return this.order;
    }
    
    setOrder(order: number) {
        this.order = order;
    }

    getOnEntries(): OnEntry[]{
        return this.onEntries;
    }
    
    addOnEntry(onEntry: OnEntry) {
        onEntry.setParent(this);
        this.onEntries.push(onEntry);
    }

    getOnExits(): OnExit[]{
        return this.onExits;
    }
    
    addOnExit(onExits: OnExit) {
        onExits.setParent(this);
        this.onExits.push(onExits);
    }
}

export class Executable {
    
    private actions: Action[];
    
    private parent: EnterableState;
    
    getActions(): Action[] {
        return this.actions;
    }
    
    addAction(action: Action) {
        if (action) {
            this.actions.push(action);
        }
    }
    
    getParent(): EnterableState {
        return this.parent;
    }
    
    setParent(parent: EnterableState) {
        this.parent = parent;
    }
}

class OnEntry extends Executable {

    private raiseEvent: boolean;

    isRaiseEvent(): boolean {
        return this.raiseEvent;
    }
    
    setRaiseEvent(raiseEvent: boolean) {
        this.raiseEvent = raiseEvent;
    }
}

class OnExit extends Executable {

    private raiseEvent: boolean;

    isRaiseEvent(): boolean {
        return this.raiseEvent;
    }
    
    setRaiseEvent(raiseEvent: boolean) {
        this.raiseEvent = raiseEvent;
    }
}

export class Action {

    private parent: Executable;
    
    getParent(): Executable {
        return this.parent;
    }
    
    setParent(parent: Executable) {
        this.parent = parent;
    }
    
    getParentEnterableState(): EnterableState {
        if (this.parent == null && this instanceof Script && this.isGlobalScript()) {
            // global script doesn't have a EnterableState
            return null;
        } else if (!this.parent) {
            throw new Error("Action "
                    + this.constructor.name + " instance missing required parent TransitionTarget");
        }
        return this.parent.getParent();
    }
    
    execute(exctx:ActionExecutionContext) {}
}

export class Assign extends Action implements ParsedValueContainer {
    
    private location: string;
    
    private src: string;
    
    private expr: string;

    private assignValue: ParsedValue;

    getLocation(): string {
        return this.location;
    }
    
    setLocation(location: string) {
        this.location = location;
    }
    
    getSrc(): string {
        return this.src;
    }
    
    setSrc(src: string) {
        this.src = src;
    }
    
    getExpr(): string {
        return this.expr;
    }
    
    setExpr(expr: string) {
        this.expr = expr;
    }
    
    getParsedValue(): ParsedValue {
        return this.assignValue;
    }
    
    setParsedValue(assignValue: ParsedValue) {
        this.assignValue = assignValue;
    }
    
    execute(exctx:ActionExecutionContext) {
        var parentState: EnterableState = this.getParentEnterableState();
        
    }    
}

export class Cancel extends Action {
    
    private sentId: string;

    private sentIdExpr: string;

    getSentId(): string {
        return this.sentId;
    }
    
    setSendId(sentId: string) {
        this.sentId = sentId;
    }
    
    getSentIdExpr(): string {
        return this.sentIdExpr;
    }
    
    setSentIdExpr(sentIdExpr: string) {
        this.sentIdExpr = sentIdExpr;
    }
}

export class Script {

    private globalScript: boolean;
    
    private script: string;
    
    private src: string;

    isGlobalScript(): boolean {
        return this.globalScript;
    }
    
    setGlobalScript(globalScript: boolean) {
        this.globalScript = globalScript;
    }
    
    getScript(): string {
        return this.script;
    }
    
    setScript(script: string) {
        this.script = script;
    }
    
    getSrc(): string {
        return this.src;
    }
    
    setSrc(src: string) {
        this.src = src;
    }
}



