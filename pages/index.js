import fs from "fs";
import matter from "gray-matter";
import path from "path";
import Layout from "../components/Layout";
import Link from "next/link";

import { Table } from "react-bootstrap";

import { postFilePaths, VENDOR_PATH } from "../utils/mdxUtils";
import { Container } from "react-bootstrap";

import useSWR from "swr";

// component

import Dropdown from "../components/DropDown";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index({ vendors }) {
  const { data, error } = useSWR("/api/staticdata", fetcher);

  //Handle the error state
  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!data) return <div>Loading...</div>;
  const venderList = JSON.parse(data)?.data;

  return (
    <Layout>
      {/* hero unit */}
      <div className="page-header py-5">
        <div className="py-4">
          <h6>USAGE BASED PRICING FOR THE WIN</h6>
          <h1>Usage Based Pricing </h1>
          <p className="mb-4 lead">
            A list of vendors that treat single sign-on as <br /> a luxury
            feature, not a core security requirement.
          </p>
        </div>
      </div>

      <Container className="mt-5">
        <Dropdown
          states={true}
          title={"Why does this exist?"}
          className="text-heading"
        >
          <div>
            <p>
              Usage Based Billing or Usage Based Pricing is a business model
              where companies choose to charge their customers basis the value
              they’re derive from product usage as opposed to the prevailing
              practice of charging per user.
            </p>{" "}
            <p>
              Companies that have adopted this new model have demonstrated their
              commitment to transparency and fairness, while also seeing
              impressive returns in the stock market. Whether they use a pure
              transaction model or a mix of transaction and subscription-based
              models, the underlying principle is the same: users are valued
              based on the actual value they derive from a product or service.
              There are a large number of metrics that can be used to determine
              the value derived by users.
            </p>
            <p>
              We’re proud to feature a comprehensive list of companies across a
              wide range of industries that have embraced usage-based billing.
              By highlighting these companies and their successes, we hope to
              inspire others to join the movement towards a more equitable,
              user-centric approach to billing.
            </p>
            <p>We hope this website is use useful for a variety of people:</p>
            <ul>
              <li>
                People looking to discover products that have embraced a usage
                based pricing model as they’re looking to find alternatives to a
                user based pricing model.{" "}
              </li>
              <li>
                People looking to launch usage based billing for their product,
                and learn from the various revenue models that exist in this
                paradigm.
              </li>
              <li>
                People looking to find technology solutions to help implement
                usage based pricing for their own products
              </li>
            </ul>
            You can contribute to any section of the website by raising a PR on
            the github repo.
          </div>
        </Dropdown>

        <div>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Usage Metric</th>
                <th>Links</th>
                <th>OSS</th>
                <th>Type</th>
                <th>Date Updated</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.filePath}>
                  <td>
                    <Link
                      href={vendor.data.url ? vendor.data.url : "#"}
                      target="_blank"
                    >
                      {vendor.data.title}
                    </Link>
                  </td>
                  <td>{vendor.data.industry}</td>
                  <td>{vendor.data.usage_metrics}</td>
                  <td>
                    {vendor.data.links ? (
                      <Link
                        href={vendor.data.links ? vendor.data.links : "#"}
                        target="_blank"
                      >
                        Annoucement
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{vendor.data.oss}</td>
                  <td>{vendor.data.type}</td>
                  <td>{vendor.data.date_updated}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <h5 className="mt-5 mb-3 text-heading">The Other List</h5>
        <p>
          Some vendors simply do not list their pricing for SSO because the
          pricing is negotiated with an account manager. These vendors get their
          own table as we assume they apply a significant premium for SSO.
        </p>
        <ul>
          {venderList &&
            venderList.map((item, index) => <li key={index}>{item.name}</li>)}
        </ul>
        <h3 className="mt-5 mb-3">FAQs</h3>
        <Dropdown
          title={
            "What is the difference between a transactional vs Usage Based Subscription? "
          }
          className="text-heading"
        >
          <p>
            We’ve followed the segmentation logic provided by OpenView Partners
            and broadly bucketed the pricing models into some variant of
            Transactional or Usage-based subscription. Transactional models are
            flexible pricing where customers only pay for what they have used
            during the period. In the UB subscription model, customers commit to
            their desired level of usage. They can upgrade or pay overages for
            more usage. If they need less usage, they can change plans (subject
            to contract terms).
          </p>
        </Dropdown>
        <Dropdown title={"What kinds of pricing models are excluded?"}>
          <p>
            For the time being, we’ve excluded business models that only have a
            user based component. Examples of such models include{" "}
            <Link href="https://tailscale.com/blog/pricing-v3/" target="_blank">
              Tailscale
            </Link>
            ,
            <Link
              href="https://app.slack.com/plans/T025W3RR3PD/pro?geocode=en-gb"
              target="_blank"
            >
              Slack
            </Link>
            . While better than a traditional user based model, these models are
            still highly skewed towards billing based on users.
          </p>
          <p>
            We’ve also excluded third party transactional payment based pricing
            models, where the end customers perform transactions on your
            platform and you take a percentage cut. This is typically the
            pricing model followed by most marketplaces or payment providers
            (e.g Stripe, Doordash).{" "}
          </p>
        </Dropdown>
        <Dropdown title={"Where can I read more on usage based pricing?"}>
          <p>
            OpenView partners does a lot of work on this space. Get started by
            seeing this playbook from them. Bessemer has a good post covering
            linear, volumetric and bundled usage based models.
          </p>
        </Dropdown>

        <hr className="my-4" />
        <div>Made and maintained with love by Appsmith.</div>
        <div className="mb-4 text-secondary">
          Contribute to this page by raising a PR on Github.
        </div>
      </Container>
    </Layout>
  );
}

export function getStaticProps() {
  const vendors = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(VENDOR_PATH, filePath));
    const { content, data } = matter(source);

    return {
      content,
      data,
      filePath,
    };
  });

  return { props: { vendors } };
}
