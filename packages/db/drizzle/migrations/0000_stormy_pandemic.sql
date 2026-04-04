CREATE TABLE "sources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(180) NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "sources_url_unique" UNIQUE("url")
);
