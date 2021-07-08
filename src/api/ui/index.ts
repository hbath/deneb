export {
    calculateVegaViewport,
    getCommandBarEditCommands,
    getCommandBarFarCommands,
    getResizablePaneDefaultWidth,
    getResizablePaneMaxSize,
    getResizablePaneMinSize,
    getResizablePaneSize,
    isApplyDialogHidden,
    isDialogOpen,
    resolveInterfaceType,
    TEditorPosition,
    TVisualInterface
};

import powerbi from 'powerbi-visuals-api';
import IViewport = powerbi.IViewport;
import ViewMode = powerbi.ViewMode;
import EditMode = powerbi.EditMode;
import { ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';

import { commandBarButtonStyles } from '../../config/styles';

import {
    isApplyButtonEnabled,
    applyChanges,
    createExportableTemplate,
    createNewSpec,
    openHelpSite,
    repairFormatJson,
    toggleAutoApply
} from '../commands';
import { getConfig } from '../config';
import { getHostLM } from '../i18n';
import { getState } from '../store';
import { IDataViewFlags } from '../../types';

const calculateVegaViewport = (
    viewport: IViewport,
    paneWidth: number,
    interfaceType: TVisualInterface,
    position: TEditorPosition
) => {
    let { height } = viewport,
        width =
            (interfaceType === 'Edit' &&
                (position === 'right'
                    ? paneWidth
                    : viewport.width - paneWidth)) ||
            viewport.width;
    height -= visualViewportAdjust.top;
    width -= visualViewportAdjust.left;
    return { width, height };
};

const getCommandBarEditCommands = (): ICommandBarItemProps[] => {
    const { autoApply, canAutoApply } = getState().visual;
    return [
        getApplyCommandItem(),
        getAutoApplyCommandItem(autoApply, canAutoApply),
        getRepairFormatCommandItem()
    ];
};

const getCommandBarFarCommands = (): ICommandBarItemProps[] => [
    getNewSpecCommandItem(),
    getExportSpecCommandItem(),
    getHelpCommandItem()
];

const getResizablePaneDefaultWidth = (
    viewport: IViewport,
    position: TEditorPosition
) => {
    if (position === 'right') {
        return viewport.width * (1 - splitPaneDefaults.defaultSizePercent);
    }
    return viewport.width * splitPaneDefaults.defaultSizePercent;
};

const getResizablePaneMaxSize = () => {
    const { editorPaneIsExpanded, settings, viewport } = getState().visual,
        { editor } = settings,
        { maxSizePercent, minSize, collapsedSize } = splitPaneDefaults,
        resolvedSize =
            (editorPaneIsExpanded &&
                (editor.position === 'right'
                    ? viewport.width - minSize
                    : viewport.width * maxSizePercent)) ||
            collapsedSize;
    return resolvedSize;
};

const getResizablePaneMinSize = () => {
    const { editorPaneIsExpanded, settings, viewport } = getState().visual,
        { editor } = settings,
        { minSize, maxSizePercent, collapsedSize } = splitPaneDefaults;
    let resolvedCollapsedSize =
            editor.position === 'right'
                ? viewport.width - collapsedSize
                : collapsedSize,
        resolvedMinSize =
            editor.position === 'right'
                ? viewport.width * (1 - maxSizePercent)
                : minSize,
        resolvedSize =
            (editorPaneIsExpanded && resolvedMinSize) || resolvedCollapsedSize;
    return resolvedSize;
};

const getResizablePaneSize = (
    paneExpandedWidth: number,
    editorPaneIsExpanded: boolean,
    viewport: IViewport,
    position: TEditorPosition
) => {
    const collapsedSize =
            position === 'right'
                ? viewport.width - splitPaneDefaults.collapsedSize
                : splitPaneDefaults.collapsedSize,
        resolvedWidth =
            (editorPaneIsExpanded && paneExpandedWidth) ||
            (editorPaneIsExpanded &&
                getResizablePaneDefaultWidth(viewport, position)) ||
            collapsedSize;
    return resolvedWidth;
};

const isApplyDialogHidden = () => {
    const { interfaceType, isDirty } = getState().visual;
    return !(isDirty && interfaceType === 'View');
};

const isDialogOpen = () => {
    const { isNewDialogVisible, isExportDialogVisible } = getState().visual;
    return isNewDialogVisible || isExportDialogVisible;
};

const resolveInterfaceType = (
    dataViewFlags: IDataViewFlags,
    editMode: EditMode,
    isInFocus: boolean,
    viewMode: ViewMode
) => {
    switch (true) {
        case dataViewFlags.hasValidDataViewMapping &&
            viewMode === ViewMode.Edit &&
            editMode === EditMode.Advanced &&
            isInFocus: {
            return 'Edit';
        }
        case !dataViewFlags.hasValidDataViewMapping: {
            return 'Landing';
        }
        default: {
            return 'View';
        }
    }
};

const splitPaneDefaults = getConfig().splitPaneDefaults;
const visualViewportAdjust = getConfig().visualViewPortAdjust;

type TEditorPosition = 'left' | 'right';
type TVisualInterface = 'Landing' | 'View' | 'Edit';

const getApplyCommandItem = (): ICommandBarItemProps => ({
    key: 'applyChanges',
    text: getHostLM().getDisplayName('Button_Apply'),
    ariaLabel: getHostLM().getDisplayName('Button_Apply'),
    iconOnly: true,
    iconProps: {
        iconName: 'Play'
    },
    buttonStyles: commandBarButtonStyles,
    disabled: isApplyButtonEnabled(),
    onClick: applyChanges
});

const getAutoApplyCommandItem = (
    enabled: boolean,
    canAutoApply: boolean
): ICommandBarItemProps => ({
    key: 'autoApply',
    text: resolveAutoApplyText(enabled),
    ariaLabel: resolveAutoApplyAriaLabel(enabled),
    iconOnly: true,
    iconProps: {
        iconName: resolveAutoApplyIcon(enabled)
    },
    toggle: true,
    checked: enabled,
    buttonStyles: commandBarButtonStyles,
    disabled: !canAutoApply,
    onClick: toggleAutoApply
});

const getRepairFormatCommandItem = (): ICommandBarItemProps => ({
    key: 'formatJson',
    text: getHostLM().getDisplayName('Button_Format_Json'),
    ariaLabel: getHostLM().getDisplayName('Button_Format_Json'),
    iconOnly: true,
    iconProps: { iconName: 'Repair' },
    buttonStyles: commandBarButtonStyles,
    onClick: repairFormatJson
});

const getNewSpecCommandItem = (): ICommandBarItemProps => ({
    key: 'reset',
    text: getHostLM().getDisplayName('Button_New'),
    iconOnly: true,
    ariaLabel: getHostLM().getDisplayName('Button_New'),
    iconProps: { iconName: 'Page' },
    buttonStyles: commandBarButtonStyles,
    onClick: createNewSpec
});

const getExportSpecCommandItem = (): ICommandBarItemProps => {
    const { spec } = getState().visual;
    return {
        key: 'export',
        text: getHostLM().getDisplayName('Button_Export'),
        iconOnly: true,
        ariaLabel: getHostLM().getDisplayName('Button_Export'),
        iconProps: { iconName: 'Share' },
        buttonStyles: commandBarButtonStyles,
        disabled: !(spec?.status === 'valid'),
        onClick: createExportableTemplate
    };
};

const getHelpCommandItem = (): ICommandBarItemProps => ({
    key: 'help',
    text: getHostLM().getDisplayName('Button_Help'),
    ariaLabel: getHostLM().getDisplayName('Button_Reset'),
    iconOnly: true,
    iconProps: { iconName: 'Help' },
    buttonStyles: commandBarButtonStyles,
    onClick: openHelpSite
});

const resolveAutoApplyAriaLabel = (enabled: boolean) =>
    enabled
        ? getHostLM().getDisplayName('Button_Auto_Apply_Off')
        : getHostLM().getDisplayName('Button_Auto_Apply_On');

const resolveAutoApplyText = (enabled: boolean) =>
    enabled
        ? getHostLM().getDisplayName('Button_Auto_Apply_Off')
        : getHostLM().getDisplayName('Button_Auto_Apply_On');

const resolveAutoApplyIcon = (enabled: boolean) =>
    enabled ? 'CircleStopSolid' : 'PlaybackRate1x';
