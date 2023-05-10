import { NgModule } from '@angular/core';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';
import { PinturaEditorComponent } from './pintura-editor.component';
import { PinturaEditorModalComponent } from './pintura-editor-modal.component';
import { PinturaEditorOverlayComponent } from './pintura-editor-overlay.component';

@NgModule({
    declarations: [
        PinturaEditorAbstractComponent,
        PinturaEditorComponent,
        PinturaEditorModalComponent,
        PinturaEditorOverlayComponent,
    ],
    imports: [],
    exports: [
        PinturaEditorAbstractComponent,
        PinturaEditorComponent,
        PinturaEditorModalComponent,
        PinturaEditorOverlayComponent,
    ],
})
export class AngularPinturaModule {}
