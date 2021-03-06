import React, { useEffect, useMemo } from "react";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import KanbanBoardFilter from "../KanbanBoardFilter/KanbanBoardFilter";
import KanbanColumn from "../KanbanColumn/KanbanColumn";
import { cardColumns } from "../DummyData";
import KanbanBoardHeader from "../KanbanBoardHeader/KanbanBoardHeader";
import { DragDropContext } from "react-beautiful-dnd";
import { useSearch } from "../hooks/useSearch";
import { useLocalStorageState } from "../hooks/useLocalStorage";

function KanbanBoard() {
  const [columns, setColumns] = useLocalStorageState("Cards", cardColumns);
  let newSearchColumns = [...columns];

  const [searchColumns, setSearchColumns] = useLocalStorageState(
    "searchCard",
    newSearchColumns
  );
  const data = useMemo(
    () =>
      columns.reduce((acc, column) => {
        return [...acc, ...column.issues];
      }, []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const { searchResults, handleChange, searchTerm } = useSearch(data, "text");

  useEffect(() => {
    const mapColumNameToIssues = searchResults.reduce((acc, issue) => {
      if (!acc[issue.category]) {
        acc[issue.category] = [];
      }
      acc[issue.category] = [...acc[issue.category], issue];
      return acc;
    }, {});

    setSearchColumns(
      searchColumns.map((searchColumns) => {
        return {
          ...searchColumns,
          issues: mapColumNameToIssues[searchColumns.name] || [],
        };
      })
    );
    setColumns(
      columns.map((column) => {
        return { ...column, issues: mapColumNameToIssues[column.name] || [] };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults]);

  function handleOnDragEnd(result) {
    if (!result) return;
    const items = Array.from(columns);

    const destinationColumn = items.find(
      (column) => column.id === result.destination.droppableId
    );
    const sourceColumn = items.find(
      (column) => column.id === result.source.droppableId
    );

    const [reorderedItem] = sourceColumn.issues.splice(result.source.index, 1);
    reorderedItem.category = destinationColumn.name;
    destinationColumn.issues.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);
    setSearchColumns(items);
  }

  return (
    <div className="page-kanban-board">
      <div className="u-margin-bottom-small">
        <BreadCrumb Tab="Issues" />
      </div>
      <div className="u-margin-bottom-large">
        <h1 className="heading-primary">Kanban board</h1>
      </div>
      <KanbanBoardFilter handleChange={handleChange} searchTerm={searchTerm} />
      <div className="board-row-wrap">
        <KanbanBoardHeader columns={columns} />
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="board-row" style={{ overflow: "auto" }}>
            {searchColumns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default KanbanBoard;
