import type { DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React, { useRef, useState } from "react";

import { EmailIcon } from "../assets/icons";
import {
  CONTEXT_MENU_CONFIG,
  DRAG_ACTIVATION_DISTANCE,
  INITIAL_PAGES,
  UI_TEXT,
  type Page
} from "../constants";
import AddPageButton from "./AddPageButton";
import AddPageTabButton from "./AddPageTabButton";
import ContextMenu from "./ContextMenu";
import FormPage from "./FormPage";
import "./FormPageManager.css";

const FormPageManager = () => {
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
  const [newlyAddedPages, setNewlyAddedPages] = useState<Set<string>>(new Set());
  const [deletingPages, setDeletingPages] = useState<Set<string>>(new Set());
  const pageTabsRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    pageId: string;
  }>({ visible: false, x: 0, y: 0, pageId: "" });

  const nextIdRef = useRef(5);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const scrollToNewPage = (pageId: string) => {
    // Small delay to ensure the page is rendered
    setTimeout(() => {
      const pageElement = document.querySelector(`[data-page-id="${pageId}"]`);
      if (pageElement && pageTabsRef.current) {
        const container = pageTabsRef.current;
        const elementRect = pageElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate scroll position to center the new page
        const scrollLeft = container.scrollLeft + 
          (elementRect.left - containerRect.left) - 
          (containerRect.width / 2) + 
          (elementRect.width / 2);
          
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const addPageAfter = (afterId: string) => {
    const newPage: Page = {
      id: nextIdRef.current.toString(),
      name: `Page ${nextIdRef.current}`,
      isActive: false,
    };
    const newPageId = newPage.id;
    nextIdRef.current++;

    // Mark this page as newly added for animation
    setNewlyAddedPages(prev => new Set(prev).add(newPageId));
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      setNewlyAddedPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(newPageId);
        return newSet;
      });
    }, 500); // Match animation duration

    setPages((items) => {
      const afterIndex = items.findIndex((item) => item.id === afterId);
      const newItems = [...items];
      newItems.splice(afterIndex + 1, 0, newPage);
      return newItems;
    });

    // Scroll to the new page
    scrollToNewPage(newPageId);
  };

  const addPageAtEnd = () => {
    const newPage: Page = {
      id: nextIdRef.current.toString(),
      name: `Page ${nextIdRef.current}`,
      isActive: false,
    };
    const newPageId = newPage.id;
    nextIdRef.current++;

    // Mark this page as newly added for animation
    setNewlyAddedPages(prev => new Set(prev).add(newPageId));
    
    // Remove the animation class after animation completes
    setTimeout(() => {
      setNewlyAddedPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(newPageId);
        return newSet;
      });
    }, 500); // Match animation duration

    setPages((items) => [...items, newPage]);

    // Scroll to the new page
    scrollToNewPage(newPageId);
  };

  const selectPage = (pageId: string) => {
    setPages((items) =>
      items.map((item) => ({
        ...item,
        isActive: item.id === pageId,
      }))
    );
  };

  const showContextMenu = (event: React.MouseEvent, pageId: string) => {
    event.preventDefault();
    event.stopPropagation();

    // Get the clicked element's position
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const {
      width: menuWidth,
      height: menuHeight,
      offset,
      minScreenMargin,
    } = CONTEXT_MENU_CONFIG;

    // Position menu above the button by default
    let x = rect.left + rect.width / 2 - menuWidth / 2;
    let y = rect.top - menuHeight - offset;

    // Adjust horizontal position if menu would go off screen
    if (x < minScreenMargin) {
      x = minScreenMargin;
    } else if (x + menuWidth > window.innerWidth - minScreenMargin) {
      x = window.innerWidth - menuWidth - minScreenMargin;
    }

    // If menu would go off the top, position it below the button
    if (y < minScreenMargin) {
      y = rect.bottom + offset;

      // If positioning below would go off the bottom, position it above viewport bottom
      if (y + menuHeight > window.innerHeight - minScreenMargin) {
        y = window.innerHeight - menuHeight - minScreenMargin;
      }
    }

    setContextMenu({
      visible: true,
      x,
      y,
      pageId,
    });
  };

  const hideContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, pageId: "" });
  };

  const renamePage = (/* pageId: string */) => {
    // Just close the menu - functionality not implemented yet
    hideContextMenu();
  };

  const duplicatePage = (/* pageId: string */) => {
    // Just close the menu - functionality not implemented yet
    hideContextMenu();
  };

  const deletePage = () => {
    const pageToDelete = contextMenu.pageId;
    
    // Don't delete if it's the only page left
    if (pages.length <= 1) {
      hideContextMenu();
      return;
    }

    // Find the page being deleted
    const pageIndex = pages.findIndex(page => page.id === pageToDelete);
    const pageToDeleteObj = pages[pageIndex];
    
    if (pageIndex === -1) {
      hideContextMenu();
      return;
    }

    // Mark page as deleting for animation
    setDeletingPages(prev => new Set(prev).add(pageToDelete));

    // Delay the actual deletion to allow animation
    setTimeout(() => {
      // If deleting the active page, select another page
      if (pageToDeleteObj.isActive) {
        // Select the next page, or the previous if it's the last page
        const nextPageIndex = pageIndex < pages.length - 1 ? pageIndex + 1 : pageIndex - 1;
        const nextPageId = pages[nextPageIndex].id;
        
        // First update the pages to select the new active page
        setPages(currentPages => 
          currentPages
            .filter(page => page.id !== pageToDelete)
            .map(page => ({
              ...page,
              isActive: page.id === nextPageId
            }))
        );
      } else {
        // Just remove the page if it's not active
        setPages(currentPages => 
          currentPages.filter(page => page.id !== pageToDelete)
        );
      }

      // Clean up deleting state
      setDeletingPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pageToDelete);
        return newSet;
      });
    }, 300); // Match animation duration

    hideContextMenu();
  };

  const setAsFirstPage = (/* pageId: string */) => {
    // Just close the menu - functionality not implemented yet
    hideContextMenu();
  };

  const copyPage = (/* pageId: string */) => {
    // Just close the menu - functionality not implemented yet
    hideContextMenu();
  };

  return (
    <div className="form-page-manager" onClick={hideContextMenu}>
      <div className="content">
        <div className="content-body">
          <div className="form-content">
            <div className="form-header">
              <h1>{UI_TEXT.form.emailQuestion}</h1>
              <p className="form-subtitle">{UI_TEXT.form.emailSubtitle}</p>
            </div>
            <div className="form-fields">
              <div className="form-field">
                <div className="email-input-container">
                  <div className="email-icon">
                    <EmailIcon />
                  </div>
                  <input
                    type="email"
                    placeholder={UI_TEXT.form.emailPlaceholder}
                  />
                  <span className="required-indicator">*</span>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="next-button">Next →</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-navigation">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pages}
            strategy={horizontalListSortingStrategy}
          >
            <div className="page-tabs" ref={pageTabsRef}>
              {pages.map((page, index) => (
                <React.Fragment key={page.id}>
                  <div className="page-tab-item" data-page-id={page.id}>
                    <FormPage
                      page={page}
                      onSelect={() => selectPage(page.id)}
                      onContextMenu={(e: React.MouseEvent) =>
                        showContextMenu(e, page.id)
                      }
                      isNewlyAdded={newlyAddedPages.has(page.id)}
                      isDeleting={deletingPages.has(page.id)}
                    />
                  </div>
                  {index < pages.length - 1 && (
                    <div className="page-connector">
                      <div className="connector-line"></div>
                      <AddPageButton onAdd={() => addPageAfter(page.id)} />
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div className="page-connector">
                <div className="connector-line"></div>
              </div>
              <div className="add-page-tab-item">
                <AddPageTabButton onAdd={addPageAtEnd} />
              </div>
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <FormPage
                page={pages.find((p) => p.id === activeId)!}
                onSelect={() => {}}
                onContextMenu={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSetAsFirst={() => setAsFirstPage()}
          onRename={() => renamePage()}
          onCopy={() => copyPage()}
          onDuplicate={() => duplicatePage()}
          onDelete={() => deletePage()}
          onClose={hideContextMenu}
          canDelete={pages.length > 1}
        />
      )}
    </div>
  );
};

export default FormPageManager;
