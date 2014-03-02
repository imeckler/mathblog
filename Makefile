OCAMLC=ocamlfind ocamlc -package js_of_ocaml -package js_of_ocaml.syntax -syntax camlp4o -I $(COREDIR) -I /home/izzy/prog/ocamlfrp -I /home/izzy/prog/compellingproof

COREDIR=/home/izzy/prog/corejs
PROOFDIR=/home/izzy/prog/compellingproof

OBJS=$(COREDIR)/time.cmo $(COREDIR)/either.cmo $(COREDIR)/option.cmo $(COREDIR)/core_list.cmo $(COREDIR)/core_array.cmo $(COREDIR)/arrow.cmo $(COREDIR)/inttbl.cmo $(COREDIR)/core_string.cmo $(COREDIR)/core_queue.cmo $(COREDIR)/core.cmo /home/izzy/prog/ocamlfrp/frp.cmo $(PROOFDIR)/jq.cmo $(PROOFDIR)/draw.cmo $(PROOFDIR)/animate.cmo $(PROOFDIR)/widget.cmo 

all: rotsym

rotsym:
	$(OCAMLC) -c rotsym.ml
	$(OCAMLC) -linkpkg $(OBJS) -o rotsym.byte rotsym.cmo
	js_of_ocaml -debuginfo -pretty rotsym.byte

clean:
	rm *.cmo
	rm *.cmi

