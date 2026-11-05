import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('client registers the sidebar tab, its body and the open button', async () => {
  const source = await readFile(path.join(root, 'client.js'), 'utf8')
  const slots = []
  const tabTypes = []
  let opened = ''

  const React = {
    createElement: () => null,
    Component: class { constructor(props) { this.props = props; this.state = {} } },
    useState: (value) => [typeof value === 'function' ? value() : value, () => {}],
    useEffect: () => {},
    useCallback: (fn) => fn,
  }
  const window = {
    __ModuleLoader__: {
      load: ({ id, factory }) => {
        assert.equal(id, 'dsh-reqtrace')
        const module = factory((name) => {
          if (name === 'react') return React
          throw new Error(`unexpected require: ${name}`)
        })
        const ctx = {
          effect: (fn) => fn(),
          locale: { bind: () => (key) => key, register: () => () => {} },
          sidebarRightTabs: { register: (definition) => { tabTypes.push(definition); return () => {} } },
          sidebarRight: { openTab: (kind) => { opened = kind } },
          slots: {
            inject: (_name, fn) => fn(),
            register: (spec) => { slots.push(spec); return () => {} },
          },
        }
        module.apply(ctx)
      },
    },
  }

  vm.runInNewContext(source, { window, console })
  assert.equal(tabTypes.length, 1)
  assert.equal(tabTypes[0].kind, 'reqtrace')
  assert.equal(tabTypes[0].guide[0].id, 'reqtrace')
  assert.equal(typeof tabTypes[0].guide[0].title, 'function')
  assert.equal(typeof tabTypes[0].guide[0].description, 'function')
  assert.ok(slots.some((spec) => spec.name === 'sidebar.right.pane.tab' && spec.key === 'dsh-reqtrace'))
  assert.ok(slots.some((spec) => spec.name === 'conversation.input.left' && spec.id === 'reqtrace-open'))
  assert.ok(slots.every((spec) => spec.name !== 'shell.overlay'))
})
