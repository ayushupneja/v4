import React, { useState, useEffect } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Head, Loader, Nav, Social, Email, Footer } from '@components';
import styled from 'styled-components';
import { GlobalStyle, theme } from '@styles';
const { colors, fontSizes, fonts } = theme;

// https://medium.com/@chrisfitkin/how-to-smooth-scroll-links-in-gatsby-3dc445299558
if (typeof window !== 'undefined') {
  // eslint-disable-next-line global-require
  require('smooth-scroll')('a[href*="#"]');
}

const SkipToContent = styled.a`
  position: absolute;
  top: auto;
  left: -999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -99;
  &:hover {
    background-color: ${colors.darkGrey};
  }
  &:focus,
  &:active {
    outline: 0;
    color: ${colors.green};
    background-color: ${colors.lightNavy};
    border-radius: ${theme.borderRadius};
    padding: 18px 23px;
    font-size: ${fontSizes.small};
    font-family: ${fonts.SFMono};
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: ${theme.transition};
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    overflow: auto;
    z-index: 99;
  }
`;

const Layout = ({ children, location }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [githubInfo, setGithubInfo] = useState({
    stars: null,
    forks: null,
  });

  useEffect(() => {
    fetch('https://api.github.com/repos/bchiang7/v4')
      .then(response => response.json())
      .then(json => {
        const { stargazers_count, forks_count } = json;
        setGithubInfo({
          stars: stargazers_count,
          forks: forks_count,
        });
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
        }
      }, 0);
    }
  }, [isLoading]);

  return (
    <StaticQuery
      query={graphql`
        query LayoutQuery {
          site {
            siteMetadata {
              title
              siteUrl
              description
            }
          }
        }
      `}
      render={({ site }) => (
        <div id="root">
          <Head metadata={site.siteMetadata} />

          <GlobalStyle />

          <SkipToContent href="#content">Skip to Content</SkipToContent>

          {isLoading ? (
            <Loader finishLoading={() => setIsLoading(false)} />
          ) : (
            <div className="container">
              <Nav />
              <Social />
              <Email />
              {children}
            </div>
          )}
        </div>
      )}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
