import {MarkdownHooks} from "react-markdown";
// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {darcula} from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

export interface MarkdownProps {
  children?: string
  truncate?: boolean
}

export default function Markdown(props: MarkdownProps) {
  return (
    <>
      <MarkdownHooks remarkPlugins={[remarkGfm]}
                     rehypePlugins={props.truncate ? [[rehypeTruncate, {maxChars: 200}]] : undefined}
                     components={{
                       h1(props) {
                         const {className, ...rest} = props;

                         // eslint-disable-next-line
                         return <h1 className={`${className} text-2xl font-bold p-2`} {...rest}/>
                       },

                       h2(props) {
                         const {className, ...rest} = props;

                         // eslint-disable-next-line
                         return <h2 className={`${className} text-xl font-bold p-2`} {...rest}/>
                       },

                       h3(props) {
                         const {className, ...rest} = props;

                         // eslint-disable-next-line
                         return <h3 className={`${className} text-lg font-bold p-2`} {...rest}/>
                       },

                       code(props) {
                         const {children, className, node, ...rest} = props
                         const match = /language-(\w+)/.exec(className || '')

                         return match ? (
                           // @ts-ignore
                           <SyntaxHighlighter
                             {...rest}
                             PreTag="div"
                             children={String(children).replace(/\n$/, '')}
                             language={match[1]}
                             style={darcula}
                           />
                         ) : (
                           <code {...rest} className={`${className} text-secondary-content font-mono`}>
                             {children}
                           </code>
                         )
                       },

                       a(props) {
                         const {className, ...rest} = props;

                         // eslint-disable-next-line
                         return <a className={`${className} link link-primary`} {...rest}/>
                       },

                       ul(props) {
                         const {className, ...rest} = props;

                         return <ul className={`${className} list`} {...rest}/>
                       },

                       li(props) {
                         const {className, ...rest} = props;

                         return <li className={`${className} list-row`} {...rest}/>
                       },

                       table(props) {
                         const {className, ...rest} = props;

                         return <div
                           className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                           <table className={`${className} table`} {...rest}/>
                         </div>
                       },
                     }}
      >{props.children}</MarkdownHooks>
    </>
  );
}