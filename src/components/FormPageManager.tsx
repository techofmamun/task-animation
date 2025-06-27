import React, { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import "./FormPageManager.css";
import FormPage from "./FormPage";
import AddPageButton from "./AddPageButton";
import AddPageTabButton from "./AddPageTabButton";
import ContextMenu from "./ContextMenu";
import { INITIAL_PAGES, CONTEXT_MENU_CONFIG, DRAG_ACTIVATION_DISTANCE, UI_TEXT, PAGE_NAMES, type Page } from "../constants";
import { EmailIcon } from "../assets/icons";

const FormPageManager = () => {
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);

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

  const addPageAfter = (afterId: string) => {
    const newPage: Page = {
      id: nextIdRef.current.toString(),
      name: `Page ${nextIdRef.current}`,
      isActive: false,
    };
    nextIdRef.current++;

    setPages((items) => {
      const afterIndex = items.findIndex((item) => item.id === afterId);
      const newItems = [...items];
      newItems.splice(afterIndex + 1, 0, newPage);
      return newItems;
    });
  };

  const addPageAtEnd = () => {
    const newPage: Page = {
      id: nextIdRef.current.toString(),
      name: `Page ${nextIdRef.current}`,
      isActive: false,
    };
    nextIdRef.current++;

    setPages((items) => [...items, newPage]);
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
    const { width: menuWidth, height: menuHeight, offset, minScreenMargin } = CONTEXT_MENU_CONFIG;

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

  const deletePage = (/* pageId: string */) => {
    // Just close the menu - functionality not implemented yet
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

  const activePage = pages.find((page) => page.isActive);

  return (
    <div className="form-page-manager" onClick={hideContextMenu}>
      <div className="content">
        <div className="content-body">
          {activePage ? (
            <div className="form-content">
              <div className="form-header">
                <h1>
                  {activePage.name === PAGE_NAMES.INFO
                    ? UI_TEXT.form.emailQuestion
                    : activePage.name}
                </h1>
                {activePage.name === PAGE_NAMES.INFO && (
                  <p className="form-subtitle">
                    {UI_TEXT.form.emailSubtitle}
                  </p>
                )}
              </div>
              <div className="form-fields">
                {activePage.name === PAGE_NAMES.INFO && (
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
                )}
                {activePage.name !== PAGE_NAMES.INFO && (
                  <>
                    <div className="form-field">
                      <label>Sample Field 1:</label>
                      <input type="text" placeholder="Enter some text..." />
                    </div>
                    <div className="form-field">
                      <label>Sample Field 2:</label>
                      <textarea
                        placeholder="Enter some description..."
                        rows={4}
                      />
                    </div>
                  </>
                )}
              </div>
              {activePage.name === PAGE_NAMES.INFO && (
                <div className="form-actions">
                  <button className="next-button">Next →</button>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>Select a page to view its content.</p>
            </div>
          )}
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
            <div className="page-tabs">
              {pages.map((page, index) => (
                <React.Fragment key={page.id}>
                  <div className="page-tab-item">
                    <FormPage
                      page={page}
                      onSelect={() => selectPage(page.id)}
                      onContextMenu={(e: React.MouseEvent) =>
                        showContextMenu(e, page.id)
                      }
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
        />
      )}
    </div>
  );
};

export default FormPageManager;
