import { Component, OnInit } from '@angular/core';
import { overlayEditor, PinturaEditor, PinturaEditorOptions } from '@pqina/pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';

@Component({
    selector: 'pintura-editor-overlay',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class PinturaEditorOverlayComponent<T>
    extends PinturaEditorAbstractComponent<T>
    implements OnInit
{
    override initEditor(element: HTMLElement, props: PinturaEditorOptions): PinturaEditor {
        return overlayEditor(element, props);
    }
}
