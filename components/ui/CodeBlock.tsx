'use client';

import Highlight, { defaultProps, type Language } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import clsx from 'clsx';
import styles from './CodeBlock.module.css';

type CodeBlockProps = {
  code: string;
  language?: Language;
  className?: string;
};

export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
  return (
    <Highlight {...defaultProps} theme={nightOwl} code={code.trim()} language={language}>
      {({ className: generatedClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={clsx(styles.wrapper, className, generatedClassName)} style={style}>
          <code className={styles.code}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
