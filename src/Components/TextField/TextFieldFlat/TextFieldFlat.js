import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Platform } from 'react-native';
import withTheme from '../../../Theme/withTheme';
import TextFieldUnderline from '../TextFieldUnderline/TextFieldUnderline';
import TextFieldLabel from '../TextFieldLabel/TextFieldLabel';
import TextFieldHelperText from '../TextFieldHelperText/TextFieldHelperText';
import styles from './TextFieldFlat.styles';
import { nonOutlinedStops } from '../TextFieldLabel/TextFieldLabel.constants';

class TextFieldFlat extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    error: PropTypes.bool,
    label: PropTypes.string,
    labelColor: PropTypes.string,
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    handleFocus: PropTypes.func,
    handleBlur: PropTypes.func,
    focused: PropTypes.bool,
    helperText: PropTypes.string,
    helperVisible: PropTypes.bool,
    helperTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    underlineColor: PropTypes.string,
    underlineActiveColor: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string,
    ]),
    leadingIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    trailingIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    dense: PropTypes.bool,
    value: PropTypes.string,
    multiline: PropTypes.bool,
    suffix: PropTypes.node,
    prefix: PropTypes.node,
    testID: PropTypes.string,
    focusedLabelColor: PropTypes.string,
  };

  static defaultProps = {
    helperVisible: true,
    labelHeight: 0,
  };

  state = {
    height: 56,
  };

  componentDidUpdate(prevProps) {
    const { value, multiline } = this.props;
    if (value && value.length && prevProps.value.length && multiline) {
      this.setState({ height: 56 });
    }
  }

  _renderLeadingIcon() {
    const { leadingIcon } = this.props;
    const isFunc = typeof leadingIcon === 'function';

    return (
      <View style={{ position: 'absolute', left: 8, top: 16 }}>
        {isFunc ? leadingIcon() : leadingIcon}
      </View>
    );
  }

  _renderTrailingIcon() {
    const { trailingIcon } = this.props;
    const isFunc = typeof trailingIcon === 'function';

    return (
      <View style={{ position: 'absolute', right: 12, top: 16 }}>
        {isFunc ? trailingIcon() : trailingIcon}
      </View>
    );
  }

  _renderPrefix() {
    const { prefix } = this.props;

    return (
      <View style={{ position: 'absolute', left: 0, top: 26 }}>
        {React.cloneElement(prefix, {
          color: prefix.props.color ? prefix.props.color : 'rgba(0, 0, 0, .57)',
          fontSize: prefix.props.fontSize ? prefix.props.fontSize : 16,
        })}
      </View>
    );
  }

  _renderSuffix() {
    const { suffix } = this.props;

    return (
      <View style={{ position: 'absolute', right: 16, top: 28 }}>
        {React.cloneElement(suffix, {
          color: suffix.props.color ? suffix.props.color : 'rgba(0, 0, 0, .57)',
          fontSize: suffix.props.fontSize ? suffix.props.fontSize : 12,
        })}
      </View>
    );
  }

  _updateTextInputHeight = e => {
    const { labelHeight } = this.state;
    if (!this.props.multiline) return;

    const nativeHeight = e.nativeEvent.contentSize.height;

    const heightOffset =
      Platform.OS === 'ios' ? labelHeight + nonOutlinedStops.active + 8 : 0;
    this.setState({
      height: Math.max(56, nativeHeight + heightOffset),
    });
  };

  _measureLabel = ({
    nativeEvent: {
      layout: { height },
    },
  }) => this.setState({ labelHeight: height });

  render() {
    const {
      style,
      containerStyle,
      error,
      label,
      labelColor,
      labelStyle,
      handleFocus,
      handleBlur,
      focused,
      helperText,
      helperVisible,
      helperTextStyle,
      underlineColor,
      underlineActiveColor,
      leadingIcon,
      trailingIcon,
      dense,
      suffix,
      prefix,
      testID,
      focusedLabelColor,
      ...rest
    } = this.props;

    let height = this.state.height;

    if (dense) {
      height = 40;
    }

    let paddingLeft = leadingIcon ? 44 : 0;
    if (prefix) paddingLeft = 16;

    const platformStyles = Platform.OS === 'web' ? { outlineWidth: 0 } : {};

    return (
      <View
        style={[
          styles.containerStyle,
          { marginBottom: helperText && helperVisible ? 20 : 0 },
          containerStyle,
        ]}>
        {label ? (
          <TextFieldLabel
            label={label}
            focused={focused}
            error={error}
            value={rest.value}
            type={'flat'}
            labelColor={labelColor}
            style={labelStyle}
            leadingIcon={!!leadingIcon}
            dense={dense}
            prefix={prefix}
            focusedLabelColor={focusedLabelColor}
            onLayout={this._measureLabel}
          />
        ) : null}
        {leadingIcon ? this._renderLeadingIcon() : null}
        {prefix ? this._renderPrefix() : null}
        <TextInput
          style={[
            styles.textField,
            styles.flatInput,
            platformStyles,
            {
              minHeight: dense ? 40 : 56,
              height: height,
              paddingBottom: rest.multiline ? 8 : 0,
              paddingTop: rest.multiline ? 24 : 16,
              paddingLeft: paddingLeft,
              paddingRight: trailingIcon || suffix ? 36 : 0,
            },
            style,
          ]}
          testID={testID}
          scrollEnabled={false}
          onContentSizeChange={e => this._updateTextInputHeight(e)}
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {trailingIcon ? this._renderTrailingIcon() : null}
        {suffix ? this._renderSuffix() : null}
        <TextFieldUnderline
          focused={focused}
          error={error}
          underlineColor={underlineColor}
          underlineActiveColor={underlineActiveColor}
        />
        <TextFieldHelperText
          error={error}
          visible={helperVisible || error}
          style={helperTextStyle}>
          {helperText}
        </TextFieldHelperText>
      </View>
    );
  }
}

export default withTheme(TextFieldFlat);
