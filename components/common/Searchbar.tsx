/** @jsxRuntime classic */
/** @jsx jsx */
import React, { FC, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import shopifyConfig from '@config/shopify'
import { ProductGrid } from 'blocks/ProductGrid/ProductGrid'
import { Button, Box, jsx, Input, Label } from 'theme-ui'
import { searchProducts } from '@lib/shopify/storefront-data-hooks/src/api/operations'
import { BaseModal } from '@components/modals'
import { throttle } from 'lodash'
import { Cross } from '@components/icons'

interface Props {
  className?: string
  id?: string
}

const Searchbar: FC<Props> = () => {
  const router = useRouter()
  const { q } = router.query
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    setIsOpen(false)
  }, [router.asPath.split('?')[0]])

  const openSearch = () => {
    prevPathRef.current = router.asPath
    setIsOpen(true)
  }

  const closeSearch = () => {
    if (router.query.q) {
      const target = (prevPathRef.current || router.asPath).split('?')[0]
      router.replace(target, undefined, { shallow: true })
    }
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <React.Fragment>
      <BaseModal
        isOpen={isOpen}
        onDismiss={() => closeSearch()}
        overlayProps={{
          style: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
          },
        }}
        contentProps={{
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            padding: '20px',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bg: 'background',
              borderRadius: 10,
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              p: 2,
            }}
          >
            <SearchInputWrapper inputRef={inputRef} onClose={closeSearch} />
          </Box>
          <SearchModalContent
            initialSearch={q && String(q)}
            onSearch={(term: string) => {
              const op = q ? 'replace' : 'push'
              router[op]({
                pathname: router.asPath.split('?')[0],
                query: {
                  q: term,
                },
              })
            }}
          />
        </Box>
      </BaseModal>

      <Box
        ref={buttonRef}
        as={Button}
        mx={2}
        onClick={() => (isOpen ? closeSearch() : openSearch())}
        aria-label="Search"
      >
        {isOpen ? (
          <Cross />
        ) : (
          <svg
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            stroke="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            />
          </svg>
        )}
      </Box>
    </React.Fragment>
  )
}

const SearchModalContent = (props: {
  initialSearch?: string
  onSearch: (term: string) => any
}) => {
  const [search, setSearch] = useState(
    props.initialSearch && String(props.initialSearch)
  )
  const [products, setProducts] = useState([] as any[])
  const [loading, setLoading] = useState(false)
  const getProducts = async (searchTerm: string) => {
    setLoading(true)
    const results = await searchProducts(shopifyConfig, String(searchTerm))
    setSearch(searchTerm)
    setProducts(results)
    setLoading(false)
    if (searchTerm) {
      props.onSearch(searchTerm)
    }
  }

  useEffect(() => {
    if (search) {
      getProducts(search)
    }
  }, [])

  const throttleSearch = useCallback(throttle(getProducts), [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        p: [1, 2],
        width: '100%',
      }}
    >
      {loading ? (
        <span>Loading...</span>
      ) : products.length ? (
        <>
          <Label>
            Search Results for "<strong>{search}</strong>"
          </Label>
          <ProductGrid
            cardProps={{
              imgHeight: 540,
              imgWidth: 540,
              imgPriority: false,
            }}
            products={products}
            offset={0}
            limit={products.length}
          ></ProductGrid>
        </>
      ) : (
        <span>
          {search ? (
            <>
              There are no products that match "<strong>{search}</strong>"
            </>
          ) : (
            <> </>
          )}
        </span>
      )}
    </Box>
  )
}

const SearchInputWrapper = ({
  inputRef,
  onClose,
}: {
  inputRef: React.RefObject<HTMLInputElement>
  onClose: () => void
}) => {
  const router = useRouter()
  const { q } = router.query
  const [value, setValue] = useState(q ? String(q) : '')
  const throttleInput = useCallback(throttle((val: string) => val, 200), [])
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Input
        ref={inputRef as any}
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          throttleInput(e.target.value)
        }}
        placeholder="Search for products..."
        sx={{
          flex: 1,
          fontSize: [2, 3],
          px: 3,
          py: 3,
          borderRadius: 10,
          border: '1px solid',
          borderColor: 'muted',
          bg: 'background',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
        }}
      />
      <Button
        onClick={onClose}
        aria-label="Close Search"
        sx={{ px: 3, py: 3 }}
      >
        <Cross />
      </Button>
    </Box>
  )
}

export default Searchbar
