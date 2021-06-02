import { rgba } from 'polished';
import styled from 'styled-components';

export const SRCTree = styled.div`
  .rc-tree-child-tree {
    display: block;
  }

  .node-motion {
    transition: all 0.3s;
    overflow-y: hidden;
  }

  .rc-tree {
    margin: 0;
    border: 1px solid transparent;
    .rc-tree-treenode {
      margin: 0;
      padding: 0;
      line-height: 24px;
      white-space: nowrap;
      list-style: none;
      outline: 0;
      .draggable {
        color: #333;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        -khtml-user-drag: element;
        -webkit-user-drag: element;
      }
      &.drop-container {
        & > .draggable {
          &::after {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            box-shadow: inset 0 0 0 2px red;
            content: '';
          }
        }
        & ~ .rc-tree-treenode {
          border-left: 2px solid chocolate;
        }
      }
      &.drop-target {
        background-color: yellowgreen;
        & ~ .rc-tree-treenode {
          border-left: none;
        }
      }
      &.filter-node {
        & > .rc-tree-node-content-wrapper {
          color: #a60000 !important;
          font-weight: bold !important;
        }
      }
      ul {
        margin: 0;
        padding: 0 0 0 18px;
      }
      .rc-tree-node-content-wrapper {
        position: relative;
        display: inline-block;
        height: 24px;
        margin: 0;
        padding: 0;
        text-decoration: none;
        vertical-align: top;
        cursor: pointer;
      }
      span {
        &.rc-tree-icon_loading {
          margin-right: 2px;
          vertical-align: top;
          background: url('data:image/gif;');
        }
        &.rc-tree-switcher {
          &.rc-tree-switcher-noop {
            cursor: auto;
          }
          &.rc-tree-switcher_open {
            background-position: -93px -56px;
          }
          &.rc-tree-switcher_close {
            background-position: -75px -56px;
          }
        }
        &.rc-tree-checkbox {
          width: 13px;
          height: 13px;
          margin: 0 3px;
          background-position: 0 0;
          &.rc-tree-checkbox-checked {
            &.rc-tree-checkbox-disabled {
              background-position: -14px -56px;
            }
          }
          &.rc-tree-checkbox-indeterminate {
            &.rc-tree-checkbox-disabled {
              position: relative;
              background: #ccc;
              border-radius: 3px;
              &::after {
                position: absolute;
                top: 5px;
                left: 3px;
                width: 5px;
                height: 0;
                border: 2px solid #fff;
                border-top: 0;
                border-left: 0;
                -webkit-transform: scale(1);
                transform: scale(1);
                content: ' ';
              }
            }
          }
        }
        &.rc-tree-checkbox-checked {
          background-position: -14px 0;
        }
        &.rc-tree-checkbox-indeterminate {
          background-position: -14px -28px;
        }
        &.rc-tree-checkbox-disabled {
          background-position: 0 -56px;
        }
      }
    }
    &:not(.rc-tree-show-line) {
      .rc-tree-treenode {
        .rc-tree-switcher-noop {
          background: none;
        }
      }
    }
    &.rc-tree-show-line {
      .rc-tree-treenode {
        &:not(:last-child) {
          & > ul {
            background: url('data:image/gif;');
          }
          & > .rc-tree-switcher-noop {
            background-position: -56px -18px;
          }
        }
        &:last-child {
          & > .rc-tree-switcher-noop {
            background-position: -56px -36px;
          }
        }
      }
    }
  }
  .rc-tree-focused {
    &:not(.rc-tree-active-focused) {
      border-color: cyan;
    }
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher,
  .rc-tree .rc-tree-treenode span.rc-tree-checkbox,
  .rc-tree .rc-tree-treenode span.rc-tree-iconEle {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 2px;
    line-height: 16px;
    vertical-align: -0.125em;
    background-color: transparent;
    background-image: url('data:image/png;');
    background-repeat: no-repeat;
    background-attachment: scroll;
    border: 0 none;
    outline: none;
    cursor: pointer;
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher.rc-tree-icon__customize,
  .rc-tree .rc-tree-treenode span.rc-tree-checkbox.rc-tree-icon__customize,
  .rc-tree .rc-tree-treenode span.rc-tree-iconEle.rc-tree-icon__customize {
    background-image: none;
  }
  .rc-tree-child-tree {
    display: none;
  }
  .rc-tree-child-tree-open {
    display: block;
  }
  .rc-tree-treenode-disabled > span:not(.rc-tree-switcher),
  .rc-tree-treenode-disabled > a,
  .rc-tree-treenode-disabled > a span {
    color: #767676;
    cursor: not-allowed;
  }
  .rc-tree-treenode-active {
    background: rgba(0, 0, 0, 0.1);
  }
  .rc-tree-node-selected {
    background-color: #ffe6b0;
    box-shadow: 0 0 0 1px #ffb951;
    opacity: 0.8;
  }
  .rc-tree-icon__open {
    margin-right: 2px;
    vertical-align: top;
    background-position: -110px -16px;
  }
  .rc-tree-icon__close {
    margin-right: 2px;
    vertical-align: top;
    background-position: -110px 0;
  }
  .rc-tree-icon__docu {
    margin-right: 2px;
    vertical-align: top;
    background-position: -110px -32px;
  }
  .rc-tree-icon__customize {
    margin-right: 2px;
    vertical-align: top;
  }
  .rc-tree-title {
    display: inline-block;
  }
  .rc-tree-indent {
    display: inline-block;
    vertical-align: bottom;
    height: 0;
  }
  .rc-tree-indent-unit {
    width: 16px;
    display: inline-block;
  }
`;

export const SRCIcon = styled.span`
  height: 24px;
  color: ${({ theme }) => theme.colors.primary};
`;
