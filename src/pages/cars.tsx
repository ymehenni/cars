import { Grid } from "@material-ui/core";
import Search from ".";
import { GetServerSideProps } from "next";
import { getMakes, Make } from "../database/getMakes";
import { getModels, Model } from "../database/getModels";
import { CarModel } from "../../api/Car";
import { getPaginatedCars } from "../database/getPaginatedCars";
import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from "@material-ui/lab";
import { useRouter } from "next/router";
import { getAsString } from "../getAsString";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";

export interface CarsListProps {
  makes: Make[];
  models: Model[];
  cars: CarModel[];
  totalPages: number;
}

export default function CarsList({
  makes,
  models,
  cars,
  totalPages,
}: CarsListProps) {
  const { query } = useRouter();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Pagination
          page={parseInt(getAsString(query.page) || "1")}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={MaterialUiLink}
              query={query}
              item={item}
              {...item}
            />
          )}
        />
        <pre style={{ fontSize: "2.5rem" }}>
          {JSON.stringify({ totalPages, cars }, null, 4)}
        </pre>
      </Grid>
    </Grid>
  );
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
  return (
    <Link href={{ pathname: "/cars", query: { ...query, page: item.page } }}>
      <a {...props} />
    </Link>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};
