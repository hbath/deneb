export {
    Assistive,
    BodyHeading,
    EditorHeading,
    Paragraph,
    Heading,
    SubHeading,
    SubHeadingSecondary
};

import * as React from 'react';

import { Text, ITextStyles, ITextProps } from '@fluentui/react/lib/Text';
import { FontSizes, FontWeights } from '@fluentui/react/lib/Styling';

import { theme } from '../../core/ui/fluent';

const assistiveStyles: ITextStyles = {
    root: {
        fontSize: FontSizes.small,
        color: theme.palette.neutralPrimary
    }
};

const headingStyles: ITextStyles = {
    root: {
        fontWeight: FontWeights.semibold,
        fontSize: FontSizes.xLarge,
        color: theme.palette.neutralPrimary
    }
};

const subHeadingStyles: ITextStyles = {
    root: {
        fontSize: FontSizes.medium,
        color: theme.palette.neutralPrimary
    }
};

const subHeadingSecondaryStyles: ITextStyles = {
    root: {
        fontSize: FontSizes.smallPlus,
        color: theme.palette.neutralSecondary
    }
};

const bodyHeadingStyles: ITextStyles = {
    root: {
        fontWeight: FontWeights.semibold,
        fontSize: FontSizes.mediumPlus,
        color: theme.palette.neutralPrimary,
        lineHeight: '2.5em'
    }
};

const editorHeadingStyles: ITextStyles = {
    root: {
        fontWeight: FontWeights.semibold,
        fontSize: FontSizes.mediumPlus,
        color: theme.palette.neutralPrimary
    }
};

const paragraphStyles: ITextStyles = {
    root: {
        fontSize: FontSizes.smallPlus,
        color: theme.palette.neutralPrimary
    }
};

const Heading: React.FC<ITextProps> = (props) => (
    <>
        <div>
            <Text {...props} styles={headingStyles}>
                {props.children}
            </Text>
        </div>
    </>
);

const SubHeading: React.FC<ITextProps> = (props) => (
    <>
        <div>
            <Text {...props} styles={subHeadingStyles}>
                {props.children}
            </Text>
        </div>
    </>
);

const SubHeadingSecondary: React.FC<ITextProps> = (props) => (
    <>
        <div>
            <Text {...props} styles={subHeadingSecondaryStyles}>
                {props.children}
            </Text>
        </div>
    </>
);

const BodyHeading: React.FC<ITextProps> = (props) => (
    <>
        <div>
            <Text {...props} styles={bodyHeadingStyles}>
                {props.children}
            </Text>
        </div>
    </>
);

const EditorHeading: React.FC<ITextProps> = (props) => (
    <>
        <div>
            <Text {...props} styles={editorHeadingStyles}>
                {props.children}
            </Text>
        </div>
    </>
);

const Paragraph: React.FC<ITextProps> = (props) => (
    <>
        <p>
            <Text {...props} styles={paragraphStyles}>
                {props.children}
            </Text>
        </p>
    </>
);

const Assistive: React.FC<ITextProps> = (props) => (
    <>
        <Text {...props} styles={assistiveStyles}>
            {props.children}
        </Text>
    </>
);
