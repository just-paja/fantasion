import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Error from 'next/error'
import React from 'react'
import Markdown from 'react-markdown'

import { asPage, MetaPage } from './meta'
import { GenericPage } from './layout'

const GalleryPhoto = ({ mediaObject }) => {
  return (
    <Image
      src={mediaObject.localPhoto.galleryPreview}
      alt={mediaObject.description}
      width={256}
      height={256}
    />
  )
}

const GalleryMediaObject = ({ mediaObject }) => {
  if (mediaObject.localPhoto || mediaObject.privatePhoto) {
    return <GalleryPhoto mediaObject={mediaObject} />
  }
  return null
}

const ArticleGallery = ({ media }) => (
  <div className="mt-3">
    {media.map((item) => (
      <GalleryMediaObject mediaObject={item} key={item.id} />
    ))}
  </div>
)

const ArticleLead = ({ text }) => (
  <div className="lead">
    <Markdown>{text}</Markdown>
  </div>
)

const ArticleBody = ({ text }) => (
  <div className="mt-3">
    <Markdown>{text}</Markdown>
  </div>
)

export const Article = ({ beforeText, title, description, media, text }) => (
  <Container as="article">
    <Row>
      <Col lg={7}>
        <h1>{title}</h1>
        {description ? <ArticleLead text={description} /> : null}
        {beforeText ? <div>{beforeText}</div> : null}
        {text ? <ArticleBody text={text} /> : null}
      </Col>
      <Col lg={5}>
        <ArticleGallery media={media} />
      </Col>
    </Row>
  </Container>
)

export const StaticArticlePage = asPage(({ article, statusCode }) => {
  if (statusCode !== 200) {
    return <Error statusCode={statusCode} />
  }
  return (
    <GenericPage>
      <MetaPage title={article.title} description={article.description} />
      <Article
        title={article.title}
        description={article.description}
        media={article.media}
        text={article.text}
      />
    </GenericPage>
  )
})
