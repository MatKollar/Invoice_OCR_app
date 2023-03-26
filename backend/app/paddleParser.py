import re
import requests


def get_invoice_number(words):
    invoice_number = ''
    for word in words:
        if 'faktura' in word.lower():
            parts = word.split()
            for part in parts:
                if part.isdigit():
                    invoice_number = part
                    return invoice_number
    return invoice_number


def get_variable_symbol(words):
    var_symbol = ''
    for word in words:
        if any([kw in word.lower() for kw in ('variabilny', 'var.symbol', 'vs:')]):
            parts = word.split()
            for part in parts:
                if part.isdigit():
                    var_symbol = part
                    return var_symbol
    return var_symbol


def get_date_of_issue(words):
    date_of_issue = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{4}")

    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('datum vystavenia', 'datum vyhotovenia', 'datum vyhotovenia:', 'vyhotovena:', 'vystavenia:')]):
            for j in range(i + 1, len(words)):
                if date_pattern.match(words[j]):
                    date_of_issue = words[j]
                    del words[j]
                    return date_of_issue
    return date_of_issue


def get_due_date(words):
    due_date = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{4}")

    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('datum splatnosti', 'splatnost', 'splatnost:', 'splatnosti:', 'splatnosti')]):
            for j in range(i + 1, len(words)):
                if date_pattern.match(words[j]):
                    due_date = words[j]
                    del words[j]
                    return due_date
    return due_date


def get_delivery_date(words):
    delivery_date = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{4}")

    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('datum dodania', 'datum uskut.', 'datum plnenia', 'dodanie', 'dodania', 'datum dan. povin.', 'danova povinnost')]):
            for j in range(i + 1, len(words)):
                if date_pattern.match(words[j]):
                    delivery_date = words[j]
                    del words[j]
                    return delivery_date
    return delivery_date


def get_payment_method(words):
    payment_method = ''
    for i, word in enumerate(words):
        if any([kw in word.lower() for kw in ('forma uhrady', 'sposob uhrady', 'forma platby', 'sposob platby', 'spos. uhrady', 'uhrada', 'platba')]):
            for j in range(i, len(words)):
                next_word = words[j]
                if any(x in next_word.lower() for x in ['prevod', 'prevodom']):
                    return 'Bankovým prevodom'
                elif any(x in next_word.lower() for x in ['hotovosť', 'hotovosťou', 'hotovosti']):
                    return 'Hotovosťou'
                elif any(x in next_word.lower() for x in ['dobierka', 'dobierkou']):
                    return 'Dobierkou'
                elif any(x in next_word.lower() for x in ['karta', 'kartou']):
                    return 'Kartou'
                elif any(x in next_word.lower() for x in ['paypal', 'paypalom']):
                    return 'PayPal'
                elif any(x in next_word.lower() for x in ['terminal', 'terminalom']):
                    return 'Platobným terminálom'
                elif ':PP' in next_word:
                    return 'PP'

    return payment_method


def get_total_price(words):
    total_price = ''
    pattern = re.compile(r"€?\b\d+(?:[,\s]\d+)*\b")
    for i, word in enumerate(words):
        if any([kw1 in word.lower() and kw2 in word.lower() for kw1, kw2 in (('celkom', '€'), ('spolu', '€'), ('celkom', 'eur'), ('spolu', 'eur'),
                                                                             ('celkova', 'suma'), ('fakturovana', 'suma'), (
                                                                                 'celkova', 'hodnota'),
                                                                             ('spolu', 'uhradu'), ('fakturovana', 'hodnota'), (
                                                                                 'celkom', 'uhrade'),
                                                                             ('na', 'zaplatenie'), ('celkom:', ''))]):
            parts = words[i + 1].split()
            for part in parts:
                if pattern.match(part):
                    total_price = part
                    return total_price
    return total_price


def get_bank(words):
    bank = ''
    for word in words:
        if 'vseobecna' in word.lower() or 'vub' in word.lower():
            bank = 'Všeobecná úverová banka'
            return bank
        if 'csob' in word.lower() or 'československá obchodná' in word.lower():
            bank = 'ČSOB'
            return bank
        if 'tatrabanka' in word.lower() or 'tatra' in word.lower():
            bank = 'Tatrabanka'
            return bank
        if 'banka' in word.lower():
            bank = 'Banka'
            return bank
    return bank


def get_swift(words):
    swift = ''
    pattern = re.compile(r'^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$')

    for i, word in enumerate(words):
        if 'swift' in word.lower():
            for j in range(i + 1, len(words)):
                next_word = words[j]
                if len(next_word) >= 8:
                    if pattern.match(next_word):
                        swift = next_word
                        return swift
                elif 'swift:' in next_word.lower():
                    possible_swift = next_word.split(':')[1]
                    if pattern.match(possible_swift):
                        swift = possible_swift
                        return swift
    return swift


def get_iban(words):
    iban = ''
    pattern = re.compile(
        r'[a-zA-Z]{2}\s*[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}')

    for i, word in enumerate(words):
        if 'iban' in word.lower() or 'ucet'.rstrip(':') in word.lower():
            for j in range(i + 1, len(words)):
                next_word = words[j]
                next_word = re.sub(r'(\d)\s+(\d)', r'\1\2', next_word)
                match = pattern.search(next_word)
                if match:
                    iban = match.group()
                    return iban
    return iban


def get_supplier_ico(words):
    ico = ''
    pattern = re.compile(r"\b\d{8}\b")
    for word in words:
        if any([kw in word.lower() for kw in ('ico', '1co:', '1ico', 'ic', '1c0', 'icq')]):
            match = pattern.search(word)
            if match:
                ico = match.group()
                del words[words.index(word)]
                return ico
    return ico


def get_buyer_ico(words):
    ico = ''
    pattern = re.compile(r"\b\d{8}\b")
    for word in words:
        if any([kw in word.lower() for kw in ('ico', '1co:', '1ico', 'ic', '1c0', 'icq')]):
            match = pattern.search(word)
            if match:
                ico = match.group()
                return ico
    return ico


def parse_text(text):
    words = text.split('\n')
    supplier_data = {}
    buyer_data = {}

    supplier_ico = get_supplier_ico(words)
    if supplier_ico:
        details_url = f"http://localhost:5000/get_details?ico={supplier_ico}"
        supplier_details = requests.post(details_url)

        if supplier_details.status_code == 200:
            supplier_data = supplier_details.json()['data']

    buyer_ico = get_buyer_ico(words)
    if buyer_ico:
        details_url = f"http://localhost:5000/get_details?ico={buyer_ico}"
        buyer_details = requests.post(details_url)

        if buyer_details.status_code == 200:
            buyer_data = buyer_details.json()['data']

    data = {
        'invoice_number': get_invoice_number(words),
        'var_symbol': get_variable_symbol(words),
        'date_of_issue': get_date_of_issue(words),
        'due_date': get_due_date(words),
        'delivery_date': get_delivery_date(words),
        'payment_method': get_payment_method(words),
        'total_price': get_total_price(words),
        'bank': get_bank(words),
        'swift': get_swift(words),
        'iban': get_iban(words),
        'buyer_ico': buyer_ico,
        'supplier_ico': supplier_ico,
        'supplier_data': supplier_data,
        'buyer_data': buyer_data
    }
    return data
