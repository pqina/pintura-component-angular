import { Input, Component, OnInit } from '@angular/core';
import { openEditor, PinturaEditorModal, PinturaEditorOptions } from '@pqina/pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';

@Component({
    selector: 'pintura-editor-modal',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class PinturaEditorModalComponent<T>
    extends PinturaEditorAbstractComponent<T>
    implements OnInit
{
    @Input() preventZoomViewport?: boolean;
    @Input() preventScrollBodyIfNeeded?: boolean;
    @Input() preventFooterOverlapIfNeeded?: boolean;
    @Input() enableAutoHide?: boolean;
    @Input() enableAutoDestroy?: boolean;

    get modal(): HTMLElement | undefined {
        return (<PinturaEditorModal>this.editor).modal;
    }

    override initEditor(element: HTMLElement, props: PinturaEditorOptions): PinturaEditorModal {
        return openEditor(props);
    }

    showEditor(): void {
        (this.editor as PinturaEditorModal).show();
    }

    hideEditor(): void {
        (this.editor as PinturaEditorModal).hide();
    }

    override ngOnDestroy(): void {
        if (!this.editor) return;
        this.editor = undefined;
    }
}
