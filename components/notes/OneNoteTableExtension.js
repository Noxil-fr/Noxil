import { Extension } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

function cellDepthAt(schema, $pos) {
  for (let d = $pos.depth; d > 0; d--) {
    const t = $pos.node(d).type
    if (t === schema.nodes.tableHeader || t === schema.nodes.tableCell) return d
  }
  return -1
}

function isFirstRow(schema, $pos) {
  for (let d = $pos.depth; d > 0; d--) {
    if ($pos.node(d).type === schema.nodes.tableRow) {
      for (let td = d - 1; td > 0; td--) {
        if ($pos.node(td).type === schema.nodes.table) {
          return $pos.index(td) === 0
        }
      }
    }
  }
  return false
}

function isSingleRowTable(schema, $pos) {
  for (let d = $pos.depth; d > 0; d--) {
    if ($pos.node(d).type === schema.nodes.table) {
      return $pos.node(d).childCount === 1
    }
  }
  return false
}

function moveCursorToNextCellInRow(editor, schema) {
  const s = editor.state
  const { $from: $f } = s.selection

  let cellEnd = -1, rowEnd = -1
  for (let d = $f.depth; d > 0; d--) {
    const t = $f.node(d).type
    if ((t === schema.nodes.tableHeader || t === schema.nodes.tableCell) && cellEnd === -1) {
      cellEnd = $f.after(d)
    }
    if (t === schema.nodes.tableRow && cellEnd !== -1) {
      rowEnd = $f.end(d)
      break
    }
  }

  if (cellEnd === -1 || rowEnd === -1) return

  let targetPos = -1
  s.doc.nodesBetween(cellEnd, rowEnd, (node, pos) => {
    if (targetPos !== -1) return false
    if (node.type === schema.nodes.tableHeader || node.type === schema.nodes.tableCell) {
      targetPos = pos + 1
      return false
    }
  })

  if (targetPos !== -1) {
    try {
      editor.view.dispatch(
        s.tr.setSelection(TextSelection.near(s.doc.resolve(targetPos), 1)).scrollIntoView()
      )
    } catch (_) {}
  }
}

export const OneNoteTable = Extension.create({
  name: 'oneNoteTable',
  priority: 200,

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const { editor } = this
        const { state } = editor
        const { selection, schema } = state
        const { $from } = selection

        const cd = cellDepthAt(schema, $from)

        if (cd !== -1) {
          if (!isFirstRow(schema, $from)) return false

          const insertPos = $from.after(cd)
          const singleRow = isSingleRowTable(schema, $from)

          // Check if a next cell already exists in this row
          let nextCellPos = -1
          for (let d = cd - 1; d > 0; d--) {
            if ($from.node(d).type === schema.nodes.tableRow) {
              const rowEnd = $from.end(d)
              state.doc.nodesBetween(insertPos, rowEnd, (node, pos) => {
                if (nextCellPos !== -1) return false
                if (node.type === schema.nodes.tableHeader || node.type === schema.nodes.tableCell) {
                  nextCellPos = pos + 1
                  return false
                }
              })
              break
            }
          }

          if (nextCellPos !== -1) {
            // Next cell exists: just move there
            try {
              editor.view.dispatch(
                state.tr.setSelection(TextSelection.near(state.doc.resolve(nextCellPos), 1)).scrollIntoView()
              )
            } catch (_) {}
            return true
          }

          // No next cell: only add column if table has a single row
          if (!singleRow) return false

          const emptyPara = schema.nodes.paragraph.createAndFill()
          const newCell = schema.nodes.tableHeader.createAndFill({}, emptyPara ? [emptyPara] : undefined)
          if (!newCell) return false

          const tr = state.tr.insert(insertPos, newCell)
          try {
            tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 2), 1))
          } catch (_) {
            try { tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1), 1)) } catch (_2) {}
          }
          editor.view.dispatch(tr.scrollIntoView())
          return true
        }

        // Outside table: cursor at end of paragraph → wrap text in 2-col table
        if (
          $from.parent.type === schema.nodes.paragraph &&
          $from.parentOffset === $from.parent.content.size
        ) {
          const text = $from.parent.textContent
          const paraDepth = $from.depth
          const paraStart = $from.before(paraDepth)
          const paraEnd = $from.after(paraDepth)

          const emptyPara = schema.nodes.paragraph.createAndFill()
          const cell1 = schema.nodes.tableHeader.createAndFill({}, emptyPara ? [emptyPara] : undefined)
          const cell2 = schema.nodes.tableHeader.createAndFill({ colwidth: [60] }, emptyPara ? [emptyPara] : undefined)
          const row = schema.nodes.tableRow.createAndFill({}, cell1 && cell2 ? [cell1, cell2] : undefined)
          const table = schema.nodes.table.createAndFill({}, row ? [row] : undefined)
          if (!table) return false

          const tr = state.tr.replaceWith(paraStart, paraEnd, table)

          let targetPos = -1
          tr.doc.nodesBetween(paraStart, paraStart + table.nodeSize, (node, pos) => {
            if (targetPos !== -1) return false
            if (node.type === schema.nodes.tableHeader) {
              targetPos = pos + 1
              return false
            }
          })
          if (targetPos !== -1) {
            try {
              tr.setSelection(TextSelection.near(tr.doc.resolve(targetPos), 1))
            } catch (_) {}
          }

          editor.view.dispatch(tr)
          if (text) editor.commands.insertContent(text)
          moveCursorToNextCellInRow(editor, schema)
          return true
        }

        return false
      },

      Backspace: () => {
        const { editor } = this
        const { state } = editor
        const { selection, schema } = state
        const { $from } = selection

        const cd = cellDepthAt(schema, $from)
        if (cd === -1) return false

        const atStart = $from.parentOffset === 0
        if (!atStart) return false

        const firstRow = isFirstRow(schema, $from)
        const singleRow = isSingleRowTable(schema, $from)
        const cellEmpty = $from.node(cd).textContent === ''

        // First row, single row table, empty cell → delete column
        if (firstRow && singleRow && cellEmpty) {
          editor.chain().deleteColumn().run()

          // Move cursor to end of last remaining cell
          const s = editor.state
          try {
            let targetPos = -1
            const { $from: $f } = s.selection
            for (let d = $f.depth; d > 0; d--) {
              if ($f.node(d).type === s.schema.nodes.tableRow) {
                s.doc.nodesBetween($f.start(d), $f.end(d), (node, pos) => {
                  if (node.type === s.schema.nodes.tableHeader || node.type === s.schema.nodes.tableCell) {
                    targetPos = pos + node.nodeSize - 2
                  }
                })
                break
              }
            }
            if (targetPos !== -1) {
              editor.view.dispatch(
                s.tr.setSelection(TextSelection.near(s.doc.resolve(targetPos), -1)).scrollIntoView()
              )
            }
          } catch (_) {}
          return true
        }

        // Not first row, cursor at start
        if (!firstRow) {
          // Check if we're in the first cell of an empty row → delete row
          let rowDepth = -1
          for (let d = cd - 1; d > 0; d--) {
            if ($from.node(d).type === schema.nodes.tableRow) { rowDepth = d; break }
          }

          const isFirstCell = rowDepth !== -1 && $from.index(rowDepth) === 0
          const rowEmpty = rowDepth !== -1 && $from.node(rowDepth).textContent === ''

          if (isFirstCell && rowEmpty) {
            editor.chain().deleteRow().run()

            // Move to last cell of the row now under the cursor (row above)
            const s = editor.state
            try {
              let targetPos = -1
              const { $from: $f } = s.selection
              for (let d = $f.depth; d > 0; d--) {
                if ($f.node(d).type === s.schema.nodes.tableRow) {
                  s.doc.nodesBetween($f.start(d), $f.end(d), (node, pos) => {
                    if (node.type === s.schema.nodes.tableHeader || node.type === s.schema.nodes.tableCell) {
                      targetPos = pos + node.nodeSize - 2
                    }
                  })
                  break
                }
              }
              if (targetPos !== -1) {
                editor.view.dispatch(
                  s.tr.setSelection(TextSelection.near(s.doc.resolve(targetPos), -1)).scrollIntoView()
                )
              }
            } catch (_) {}
            return true
          }

          // Not first cell or row not empty → go to previous cell
          editor.commands.goToPreviousCell()
          return true
        }

        return false
      },

      Enter: () => {
        const { editor } = this
        const { state } = editor
        const { selection, schema } = state
        const { $from } = selection

        let inHeader = false, rowDepth = -1, tableDepth = -1

        for (let d = $from.depth; d > 0; d--) {
          const type = $from.node(d).type
          if (type === schema.nodes.tableHeader) inHeader = true
          if (type === schema.nodes.tableRow && inHeader) rowDepth = d
          if (type === schema.nodes.table && inHeader) { tableDepth = d; break }
          if (type === schema.nodes.tableCell) break
        }

        if (!inHeader || rowDepth === -1 || tableDepth === -1) return false

        const table = $from.node(tableDepth)
        const headerRowEnd = $from.after(rowDepth)

        if (table.childCount <= 1) {
          editor.chain().addRowAfter().run()
        }

        const newState = editor.state
        const newDoc = newState.doc
        let targetPos = -1

        newDoc.nodesBetween(headerRowEnd, newDoc.content.size, (node, pos) => {
          if (targetPos !== -1) return false
          if (node.type === newState.schema.nodes.tableCell) {
            targetPos = pos + 1
            return false
          }
        })

        if (targetPos !== -1) {
          try {
            const $pos = newDoc.resolve(targetPos)
            editor.view.dispatch(
              newState.tr.setSelection(TextSelection.near($pos, 1)).scrollIntoView()
            )
          } catch (_) {}
        }

        return true
      },
    }
  },
})
