package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"bitbucket.org/vdumeaux/mixt/mixt/mixt"

	"github.com/fjukstad/kvik/genecards"
	"github.com/gorilla/mux"
)

type Genes struct {
	Genes   []Gene
	Tissues []string
}

type Gene struct {
	Name    string
	Modules []string
	Summary string
}

func GeneResults(genes []string) ([]Gene, []string, error) {
	var result []Gene
	for _, gene := range genes {
		hits, _ := SearchForGene(gene)
		fmt.Println(hits)
		for _, h := range hits {

			modules, err := mixt.GetAllModuleNames(h)
			if err != nil {
				fmt.Println("Could not get modules for ", h)
				return []Gene{}, []string{}, err
			}

			summary := genecards.Summary(h)

			s := strings.SplitAfterN(summary, ".", 2)

			shortSummary := s[0] + ".."

			g := Gene{h, modules, shortSummary}
			result = append(result, g)
		}
	}

	tissues, err := mixt.GetTissues()
	if err != nil {
		fmt.Println("Could not get tissues")
		//http.Error(w, err.Error(), 503)
		return []Gene{}, []string{}, err
	}

	return result, tissues, nil
}

func GeneSummaryHandler(w http.ResponseWriter, r *http.Request) {
	if !LoggedIn(r) {
		http.Redirect(w, r, "/", 302)
		return
	}

	vars := mux.Vars(r)
	geneName := vars["gene"]

	var summary string
	summary = genecards.Summary(geneName)
	if summary == "" {
		summary = "no preview available..."
	}

	w.Write([]byte(summary))

}
