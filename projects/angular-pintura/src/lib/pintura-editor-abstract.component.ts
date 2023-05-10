import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    NgZone,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import {
    ImageSource,
    PinturaEditorOptions,
    PinturaEditor,
    PinturaEditorHistoryAPI,
    PinturaDefaultImageReaderResult,
    PinturaDefaultImageWriterResult,
    PinturaReadState,
    PinturaWriteState,
    PinturaImageState,
    PinturaNode,
    Sticker,
    PinturaEditorStatus,
    Size,
    Rect,
    Shape,
    dispatchEditorEvents,
    Color,
    ColorMatrix,
    ConvolutionMatrix,
    ShapeRectangle,
    PinturaMetadata,
    OptionGroup,
    CropPresetOption,
    StickerGroup,
    Effect,
    SizeOption,
    LocaleString,
    MarkupEditorToolStyleDefaults,
    MarkupEditorShapeStyleControlDefaults,
    Vector,
    Filter,
} from '@pqina/pintura';

type Unsub = () => void;

@Component({
    template: '',
})
export class PinturaEditorAbstractComponent<T> implements OnInit {
    protected element: ElementRef;
    protected zone: NgZone;
    private unsubs: Unsub[] = [];

    // A reference to the editor JavaScript instance
    public editor: PinturaEditor | undefined;

    // A shortcut to assign multiple props at once
    @Input() options?: PinturaEditorOptions = undefined;

    // Inputs
    @Input() id?: string;
    @Input() class?: string;
    @Input() animations?: boolean;
    @Input() src?: ImageSource;
    @Input() util?: string;
    @Input() utils?: string[];
    @Input() disabled?: boolean;
    @Input() status?: PinturaEditorStatus;
    @Input() elasticityMultiplier?: number;
    @Input() layoutDirectionPreference?: 'auto' | 'horizontal' | 'vertical';
    @Input() layoutVerticalUtilsPreference?: 'left' | 'right';
    @Input() layoutHorizontalUtilsPreference?: 'bottom' | 'top';
    @Input() layoutVerticalControlGroupsPreference?: 'bottom' | 'top';
    @Input() layoutVerticalControlTabsPreference?: 'bottom' | 'top';
    @Input() layoutVerticalToolbarPreference?: 'bottom' | 'top';
    @Input() imageSourceToImageData?: (src: any) => Promise<ImageData>;
    @Input() previewImageData?: ImageBitmap | ImageData | HTMLCanvasElement;
    @Input() previewImageDataMaxSize?: Size;
    @Input() previewUpscale?: boolean;
    @Input() previewPad?: boolean;
    @Input() previewMaskOpacity?: number;
    @Input() shapePreprocessor?: any;
    @Input() enableCanvasAlpha?: boolean;
    @Input() enableButtonClose?: boolean;
    @Input() enableButtonExport?: boolean;
    @Input() enableButtonResetHistory?: boolean;
    @Input() enableButtonRevert?: boolean;
    @Input() enableNavigateHistory?: boolean;
    @Input() enableToolbar?: boolean;
    @Input() enableUtils?: boolean;
    @Input() enableDropImage?: boolean;
    @Input() enablePasteImage?: boolean;

    @Input() enableZoom?: boolean;
    @Input() enableZoomControls?: boolean;
    @Input() enablePan?: boolean;
    @Input() zoomLevel?: number | undefined | null;
    @Input() zoomPresetOptions?: number[];
    @Input() zoomAdjustStep?: number;
    @Input() zoomAdjustFactor?: number;
    @Input() zoomAdjustWheelFactor?: number;
    @Input() enablePanInput?: boolean;
    @Input() enableZoomInput?: boolean;

    @Input() willSetMediaInitialTimeOffset?: (duration: number, trim: [number, number][]) => number;
    @Input() muteAudio?: boolean;

    @Input() handleEvent?: (type: string, detail: any) => void;
    @Input() willRequestResource?: (url: string) => boolean;
    @Input() willClose?: () => Promise<boolean>;
    @Input() willRevert?: () => Promise<boolean>;
    @Input() willProcessImage?: () => Promise<boolean>;
    @Input() willRenderCanvas?: (
        shapes: {
            decorationShapes: Shape[];
            annotationShapes: Shape[];
            interfaceShapes: Shape[];
        },
        state: any
    ) => {
        decorationShapes: Shape[];
        annotationShapes: Shape[];
        interfaceShapes: Shape[];
    };
    @Input() willSetHistoryInitialState?: (initialState: any) => any;
    @Input() willRenderToolbar?: (
        nodes: PinturaNode[],
        env: any,
        redraw: () => void
    ) => PinturaNode[];
    @Input() beforeSelectShape?: (current: Shape | undefined, target: Shape) => boolean;
    @Input() beforeDeselectShape?: (current: Shape, target: Shape | undefined) => boolean;
    @Input() beforeAddShape?: (shape: Shape) => boolean;
    @Input() beforeRemoveShape?: (shape: Shape) => boolean;
    @Input() beforeUpdateShape?: (shape: Shape, props: any, context: Rect) => Shape;
    @Input() willRenderShapeControls?: (nodes: PinturaNode[], shapeId: string) => PinturaNode[];
    @Input() willRenderShapePresetToolbar?: (
        nodes: PinturaNode[],
        addPreset: (sticker: Sticker) => void,
        env: any,
        redraw: () => void
    ) => PinturaNode[];

    @Input() locale: any;
    @Input() imageReader: any[];
    @Input() imageWriter?: any[];
    @Input() imageOrienter?: any;
    @Input() imageScrambler?: any;

    // Image props
    @Input() imageBackgroundColor?: Color;
    @Input() imageBackgroundImage?: ImageSource;
    @Input() imageColorMatrix?: ColorMatrix;
    @Input() imageConvolutionMatrix?: ConvolutionMatrix;
    @Input() imageCrop?: Rect;
    @Input() imageCropAspectRatio?: number | undefined;
    @Input() imageCropLimitToImage?: boolean;
    @Input() imageCropMaxSize?: Size;
    @Input() imageCropMinSize?: Size;
    @Input() imageRedaction?: ShapeRectangle[];
    @Input() imageAnnotation?: Shape[];
    @Input() imageDecoration?: Shape[];
    @Input() imageFlipX?: boolean;
    @Input() imageFlipY?: boolean;
    @Input() imageGamma?: number;
    @Input() imageNoise?: number;
    @Input() imageRotation?: number;
    @Input() imageVignette?: number;
    @Input() imageTargetSize?: Size;
    @Input() imageFrame?:
        | string
        | {
              [key: string]: any;
              frameStyle: string;
          };
    @Input() imageMetadata?: PinturaMetadata;
    @Input() imageState?: PinturaImageState;
    @Input() imageDuration?: number;
    @Input() imageTrim?: undefined | [number, number][];
    @Input() imageVolume?: undefined | number;

    get history(): PinturaEditorHistoryAPI | undefined {
        return this.editor?.history;
    }

    get imageSize(): Size | undefined {
        return this.editor?.imageSize;
    }

    get imageAspectRatio(): number | undefined {
        return this.editor?.imageAspectRatio;
    }

    get imageCropSize(): Size | undefined {
        return this.editor?.imageCropSize;
    }

    get imageCropRectAspectRatio(): number | undefined {
        return this.editor?.imageCropRectAspectRatio;
    }

    get imageFile(): File | undefined {
        return this.editor?.imageFile;
    }

    get imageLoadState(): any {
        return this.editor?.imageLoadState;
    }

    get imageProcessState(): any {
        return this.editor?.imageProcessState;
    }

    get imageRotationRange(): [number, number] | undefined {
        return this.editor?.imageRotationRange;
    }

    @Input() enableSelectToolToAddShape?: boolean;
    @Input() enableTapToAddText?: boolean;
    @Input() markupEditorToolbar?: [string, LocaleString, any][];
    @Input() markupEditorToolStyles?: MarkupEditorToolStyleDefaults;
    @Input() markupEditorShapeStyleControls?: MarkupEditorShapeStyleControlDefaults;
    @Input() markupEditorToolSelectRadius?: number;
    @Input() markupEditorTextInputMode?: 'modal' | 'inline';
    @Input() markupEditorZoomLevels?: number[];
    @Input() markupEditorZoomAdjustStep?: number;
    @Input() markupEditorZoomAdjustFactor?: number;
    @Input() markupEditorZoomAdjustWheelFactor?: number;
    @Input() markupEditorZoomLevel?: number;
    @Input() markupEditorToolRetainStyles?: boolean;
    @Input() markupEditorWillStartInteraction?: (point: Vector, image: Rect) => boolean;

    // Plugin props
    @Input() cropAutoCenterImageSelectionTimeout?: undefined | number;
    @Input() cropWillRenderImageSelectionGuides?:
        | undefined
        | ((
              interaction: string,
              interactionFraction: number
          ) => { rows: number; cols: number; opacity: number });
    @Input() cropEnableButtonFlipHorizontal?: boolean;
    @Input() cropEnableButtonFlipVertical?: boolean;
    @Input() cropEnableButtonRotateLeft?: boolean;
    @Input() cropEnableButtonRotateRight?: boolean;
    @Input() cropEnableButtonToggleCropLimit?: boolean;
    @Input() cropEnableCenterImageSelection?: boolean;
    @Input() cropEnableImageSelection?: boolean;
    @Input() cropEnableInfoIndicator?: boolean;
    @Input() cropEnableLimitWheelInputToCropSelection?: boolean;
    @Input() cropEnableRotationInput?: boolean;
    @Input() cropEnableSelectPreset?: boolean;
    @Input() cropEnableZoomInput?: boolean;
    @Input() cropEnableZoomMatchImageAspectRatio?: boolean;
    @Input() cropEnableZoomTowardsWheelPosition?: boolean;
    @Input() cropEnableZoomAutoHide?: boolean;
    @Input() cropImageSelectionCornerStyle?: undefined | 'hook' | 'round' | 'invisible';
    @Input() cropSelectPresetOptions?: OptionGroup[] | CropPresetOption[];
    @Input() cropSelectPresetFilter?: 'landscape' | 'portrait' | false;
    @Input() cropEnableRotateMatchImageAspectRatio?: 'never' | 'custom' | 'always';
    @Input() cropMinimizeToolbar?: 'never' | 'auto' | 'always';
    @Input() cropWillRenderTools?: (
        nodes: PinturaNode[],
        env: any,
        redraw: () => void
    ) => PinturaNode[];

    @Input() annotateActiveTool?: string;
    @Input() annotateEnableButtonFlipVertical?: boolean;
    @Input() annotatePresets?: Sticker[] | StickerGroup[];

    @Input() decorateActiveTool?: string;
    @Input() decorateEnableButtonFlipVertical?: boolean;
    @Input() decoratePresets?: Sticker[] | StickerGroup[];

    @Input() filterFunctions?: { [key: string]: Filter };
    @Input() filterOptions?: any;

    @Input() finetuneControlConfiguration?: { [key: string]: Effect };
    @Input() finetuneOptions?: [string | undefined, LocaleString];

    @Input() resizeMaxSize?: Size;
    @Input() resizeMinSize?: Size;
    @Input() resizeSizePresetOptions?: OptionGroup[] | SizeOption[];
    @Input() resizeWidthPresetOptions?: OptionGroup[] | SizeOption[];
    @Input() resizeHeightPresetOptions?: OptionGroup[] | SizeOption[];
    @Input() resizeWillRenderFooter?: (
        nodes: PinturaNode[],
        env: any,
        redraw: () => void
    ) => PinturaNode[];

    @Input() frameStyles?: {
        [key: string]: {
            shape: {
                frameStyle: string;
                [key: string]: any;
            };
            thumb: string;
        };
    };
    @Input() frameOptions?: [string | undefined, LocaleString][];

    @Input() fillOptions?: (number[] | string)[];

    @Input() stickers?: Sticker[] | StickerGroup[];
    @Input() stickerStickToImage?: boolean;
    @Input() stickersEnableButtonFlipVertical?: boolean;

    // Events
    @Output() init: EventEmitter<PinturaEditor> = new EventEmitter<PinturaEditor>();
    @Output() loadstart: EventEmitter<void> = new EventEmitter<void>();
    @Output() loadabort: EventEmitter<PinturaReadState> = new EventEmitter<PinturaReadState>();
    @Output() loaderror: EventEmitter<PinturaReadState> = new EventEmitter<PinturaReadState>();
    @Output() loadprogress: EventEmitter<PinturaReadState> = new EventEmitter<PinturaReadState>();
    @Output() load: EventEmitter<PinturaDefaultImageReaderResult> =
        new EventEmitter<PinturaDefaultImageReaderResult>();
    @Output() processstart: EventEmitter<void> = new EventEmitter<void>();
    @Output() processabort: EventEmitter<PinturaWriteState> = new EventEmitter<PinturaWriteState>();
    @Output() processerror: EventEmitter<PinturaWriteState> = new EventEmitter<PinturaWriteState>();
    @Output() processprogress: EventEmitter<PinturaWriteState> =
        new EventEmitter<PinturaWriteState>();
    @Output() process: EventEmitter<PinturaDefaultImageWriterResult> =
        new EventEmitter<PinturaDefaultImageWriterResult>();
    @Output() update: EventEmitter<PinturaImageState> = new EventEmitter<PinturaImageState>();
    @Output() undo: EventEmitter<number> = new EventEmitter<number>();
    @Output() redo: EventEmitter<number> = new EventEmitter<number>();
    @Output() revert: EventEmitter<void> = new EventEmitter<void>();
    @Output() writehistory: EventEmitter<void> = new EventEmitter<void>();
    @Output() destroy: EventEmitter<void> = new EventEmitter<void>();
    @Output() show: EventEmitter<void> = new EventEmitter<void>();
    @Output() hide: EventEmitter<void> = new EventEmitter<void>();
    @Output() close: EventEmitter<void> = new EventEmitter<void>();
    @Output() ready: EventEmitter<void> = new EventEmitter<void>();
    @Output() loadpreview: EventEmitter<ImageData | ImageBitmap> = new EventEmitter<
        ImageData | ImageBitmap
    >();
    @Output() addshape: EventEmitter<Shape> = new EventEmitter<Shape>();
    @Output() selectshape: EventEmitter<Shape> = new EventEmitter<Shape>();
    @Output() updateshape: EventEmitter<Shape> = new EventEmitter<Shape>();
    @Output() removeshape: EventEmitter<Shape> = new EventEmitter<Shape>();
    @Output() markuptap: EventEmitter<{ target?: Shape; position: Vector }> = new EventEmitter<{
        target?: Shape;
        position: Vector;
    }>();
    @Output() markupzoom: EventEmitter<number> = new EventEmitter<number>();
    @Output() markuppan: EventEmitter<Vector> = new EventEmitter<Vector>();
    @Output() zoom: EventEmitter<number> = new EventEmitter<number>();
    @Output() pan: EventEmitter<Vector> = new EventEmitter<Vector>();
    @Output() selectstyle: EventEmitter<{ [key: string]: unknown }> = new EventEmitter<{
        [key: string]: unknown;
    }>();
    @Output() selectutil: EventEmitter<string> = new EventEmitter<string>();
    @Output() selectcontrol: EventEmitter<string> = new EventEmitter<string>();

    // map functions
    loadImage(src: ImageSource, options: PinturaEditorOptions) {
        return this.editor?.loadImage(src, options);
    }

    editImage(src: ImageSource, options: PinturaEditorOptions) {
        return this.editor?.editImage(src, options);
    }

    updateImage(src: ImageSource) {
        return this.editor?.updateImage(src);
    }

    updateImagePreview(src: ImageSource) {
        return this.editor?.updateImagePreview(src);
    }

    abortLoadImage() {
        return this.editor?.abortLoadImage();
    }

    removeImage() {
        return this.editor?.removeImage();
    }

    processImage(src: ImageSource, options: PinturaEditorOptions) {
        return this.editor?.processImage(src, options);
    }

    abortProcessImage() {
        return this.editor?.abortProcessImage();
    }

    closeEditor() {
        return this.editor?.close();
    }

    constructor(element: ElementRef, zone: NgZone) {
        this.element = element;
        this.zone = zone;
    }

    // EventHandlerNonNull
    private routeEvent = (e: CustomEvent) => {
        // @ts-ignore
        const emitter = this[e.type.split(':')[1]];
        if (!emitter) return;
        emitter.emit(e.detail);
    };

    initEditor(element: HTMLElement, props: PinturaEditorOptions): PinturaEditor {
        // @ts-ignore
        return;
    }

    private _initialChanges = {};

    ngAfterViewInit(): void {
        this.element.nativeElement.classList.add('PinturaRootWrapper');

        // will block angular from listening to events inside the editor
        this.zone.runOutsideAngular(() => {
            // create editor instance
            this.editor = this.initEditor(
                this.element.nativeElement,
                Object.assign(
                    {},
                    // deprecated options object
                    this.options,

                    // new changes object
                    this._initialChanges
                )
            );

            // route events to component native element
            this.unsubs = dispatchEditorEvents(this.editor, this.element.nativeElement);
        });

        // route events
        Object.keys(this)
            // @ts-ignore
            .filter((key) => this[key] instanceof EventEmitter)
            .forEach((key) => {
                this.element.nativeElement.addEventListener(`pintura:${key}`, this.routeEvent);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // turn into options object ready to be assigned to editor
        const options = Object.entries(changes).reduce((options, [prop, change]) => {
            // @ts-ignore
            options[prop] = change.currentValue;
            return options;
        }, {});

        // no editor yet, let's store the object for when the editor loads
        if (!this.editor) {
            this._initialChanges = options;
            return;
        }

        // an editor is active, let's assign the options to the editor
        Object.assign(
            this.editor,

            // old options object
            this.options,

            // new merged changes
            options
        );
    }

    ngOnDestroy(): void {
        this._initialChanges = {};

        if (!this.editor) return;

        this.editor.destroy();

        // unsubscribe
        this.unsubs.forEach((unsub) => unsub());
        this.unsubs = [];

        // unroute events
        Object.keys(this)
            // @ts-ignore
            .filter((key) => this[key] instanceof EventEmitter)
            .forEach((key) => {
                this.element.nativeElement.removeEventListener(`pintura:${key}`, this.routeEvent);
            });

        this.editor = undefined;
    }

    ngOnInit(): void {
        // Do nothing
    }
}
