

export class Scxml {
    
    
    
    
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
        if (parent == null) {
            throw "Parent parameter cannot be null";
        }
        /*if (this == parent) {
            throw "Cannot set self as parent";
        }*/
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



export class ActionExecutionContext {
    
    
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
    
    private actions:Action[];
    
    private parent:EnterableState;
    
    getActions():Action[] {
        return this.actions;
    }
    
    addAction(action:Action) {
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
    
    execute(exctx:ActionExecutionContext) {}    
}
