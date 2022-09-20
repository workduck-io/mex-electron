import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import mergeRefs from "react-merge-refs";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useRole,
  useDismiss,
  useFloating,
  FloatingFocusManager,
  useInteractions,
  useListNavigation,
  useTypeahead,
  FloatingOverlay
} from "@floating-ui/react-dom-interactions";

export const MenuItem = forwardRef<
  HTMLButtonElement,
  { label: string; disabled?: boolean }
>(({ label, disabled, ...props }, ref) => {
  return (
    <button {...props} ref={ref} role="menuitem" disabled={disabled}>
      {label}
    </button>
  );
});

interface Props {
  label?: string;
  nested?: boolean;
}

export const Menu = forwardRef<any, Props & React.HTMLProps<HTMLButtonElement>>(
  ({ children }, ref) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const listContentRef = useRef(
      Children.map(children, (child) =>
        isValidElement(child) ? child.props.label : null
      ) as Array<string | null>
    );

    const {
      x,
      y,
      reference,
      floating,
      strategy,
      refs,
      update,
      context
    } = useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 5, alignmentAxis: 4 }), flip(), shift()],
      placement: "right-start"
    });

    const { getFloatingProps, getItemProps } = useInteractions([
      useRole(context, { role: "menu" }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        onNavigate: setActiveIndex,
        focusItemOnOpen: false
      }),
      useTypeahead(context, {
        enabled: open,
        listRef: listContentRef,
        onMatch: setActiveIndex,
        activeIndex
      })
    ]);

    useEffect(() => {
      if (open && refs.reference.current && refs.floating.current) {
        return autoUpdate(
          refs.reference.current,
          refs.floating.current,
          update
        );
      }
    }, [open, update, refs.reference, refs.floating]);

    const mergedReferenceRef = useMemo(() => mergeRefs([ref, reference]), [
      reference,
      ref
    ]);

    useEffect(() => {
      function onContextMenu(e: MouseEvent) {
        e.preventDefault();
        mergedReferenceRef({
          getBoundingClientRect() {
            return {
              x: e.clientX,
              y: e.clientY,
              width: 0,
              height: 0,
              top: e.clientY,
              right: e.clientX,
              bottom: e.clientY,
              left: e.clientX
            };
          }
        });
        setOpen(true);
      }

      document.addEventListener("contextmenu", onContextMenu);
      return () => {
        document.removeEventListener("contextmenu", onContextMenu);
      };
    }, [mergedReferenceRef]);

    useLayoutEffect(() => {
      if (open) {
        refs.floating.current?.focus();
      }
    }, [open, refs.floating]);

    return (
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll>
            <FloatingFocusManager context={context} preventTabbing>
              <div
                {...getFloatingProps({
                  className: "ContextMenu",
                  ref: floating,
                  style: {
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0
                  }
                })}
              >
                {Children.map(
                  children,
                  (child, index) =>
                    isValidElement(child) &&
                    cloneElement(
                      child,
                      getItemProps({
                        tabIndex: -1,
                        role: "menuitem",
                        className: "MenuItem",
                        ref(node: HTMLButtonElement) {
                          listItemsRef.current[index] = node;
                        }
                      })
                    )
                )}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    );
  }
);
